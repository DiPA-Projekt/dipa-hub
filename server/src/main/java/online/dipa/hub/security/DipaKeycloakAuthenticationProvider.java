package online.dipa.hub.security;

import java.util.ArrayList;
import java.util.List;

import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;

public class DipaKeycloakAuthenticationProvider extends KeycloakAuthenticationProvider {

    @Override
    public Authentication authenticate(final Authentication authentication) throws AuthenticationException {
        final KeycloakAuthenticationToken token = (KeycloakAuthenticationToken) super.authenticate(authentication);

        final List<GrantedAuthority> grantedAuthorities = new ArrayList<>(token.getAuthorities());

        //throw new BadCredentialsException("Everything is bad!");

        return new KeycloakAuthenticationToken(token.getAccount(), token.isInteractive(), grantedAuthorities);
    }
}
