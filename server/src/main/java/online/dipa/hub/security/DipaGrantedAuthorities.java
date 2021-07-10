package online.dipa.hub.security;

import org.springframework.security.core.GrantedAuthority;

public enum DipaGrantedAuthorities implements GrantedAuthority {

    TENANT_MEMBER;

    @Override
    public String getAuthority() {
        return "ROLE_" + name();
    }
}
