package online.dipa.hub.security;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;

import online.dipa.hub.persistence.entities.UserEntity;
import online.dipa.hub.persistence.repositories.UserRepository;

public class DipaKeycloakAuthenticationProvider extends KeycloakAuthenticationProvider {

    private final UserRepository userRepository;

    public DipaKeycloakAuthenticationProvider(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Authentication authenticate(final Authentication authentication) throws AuthenticationException {
        final KeycloakAuthenticationToken token = (KeycloakAuthenticationToken) super.authenticate(authentication);

        // If not in tenant database, just return a plain keycloak user.
        return lookupUserEntity(token).map(user -> createDipaToken(token, user))
                                      .orElse(token);
    }

    private KeycloakAuthenticationToken createDipaToken(final KeycloakAuthenticationToken token,
            final UserEntity user) {
        final List<GrantedAuthority> grantedAuthorities = new ArrayList<>(token.getAuthorities());

        grantedAuthorities.add(DipaGrantedAuthorities.TENANT_MEMBER);

        return new DipaKeycloakAuthenticationToken(user.getId(), token.getAccount(), token.isInteractive(),
                grantedAuthorities);
    }

    private Optional<UserEntity> lookupUserEntity(final KeycloakAuthenticationToken token) {
        final String currentUserKeycloakId = token.getAccount()
                                                  .getKeycloakSecurityContext()
                                                  .getToken()
                                                  .getSubject()
                                                  .intern();

        return userRepository.findByKeycloakId(currentUserKeycloakId);
    }
}
