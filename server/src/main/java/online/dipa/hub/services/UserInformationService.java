package online.dipa.hub.services;

import online.dipa.hub.api.model.User;
import org.keycloak.adapters.OidcKeycloakAccount;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class UserInformationService {

    public User getUserData() {
        User currentUser = new User();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof KeycloakAuthenticationToken) {

            OidcKeycloakAccount account = ((KeycloakAuthenticationToken) authentication).getAccount();
            AccessToken token = account.getKeycloakSecurityContext().getToken();

            @SuppressWarnings("unchecked")
            List<String> groups = (List<String>) token.getOtherClaims().get("groups");
            groups.replaceAll(name -> String.valueOf(name.charAt(name.length() - 1)));

            currentUser
                    .name(token.getName())
                    .email(token.getEmail())
                    .roles(new ArrayList<>(account.getRoles()))
                    .groups(groups);
        }
        return currentUser;
    }
}
