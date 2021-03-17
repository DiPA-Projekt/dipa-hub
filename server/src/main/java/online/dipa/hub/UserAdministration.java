package online.dipa.hub;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import org.keycloak.representations.AccessToken;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;

@Component
public class UserAdministration {
    
    @Bean
    @Scope(scopeName = WebApplicationContext.SCOPE_REQUEST,
            proxyMode = ScopedProxyMode.TARGET_CLASS)
    public AccessToken getAccessToken() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest();
        return ((KeycloakAuthenticationToken) request.getUserPrincipal()).getAccount().getKeycloakSecurityContext()
                                                            .getToken();
    }

    @SuppressWarnings("unchecked")
    public List<String> getGroups() {
        List<String> groups = (List<String>) getAccessToken().getOtherClaims().get("groups");
        groups.replaceAll(name -> String.valueOf(name.charAt(name.length() - 1)));

        return groups;
    }

    public List<String> getRoles() {
        return new ArrayList<>(getAccessToken().getRealmAccess()
                                                .getRoles());
    }
}
