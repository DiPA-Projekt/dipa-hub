package online.dipa.hub.security;

import java.util.Collection;

import org.keycloak.adapters.spi.KeycloakAccount;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class DipaKeycloakAuthenticationToken extends KeycloakAuthenticationToken {

    private final Long userEntityId;

    public DipaKeycloakAuthenticationToken(final Long userEntityId, final KeycloakAccount account,
            final boolean interactive, final Collection<? extends GrantedAuthority> authorities) {
        super(account, interactive, authorities);
        this.userEntityId = userEntityId;
    }

    public Long getUserEntityId() {
        return userEntityId;
    }
}
