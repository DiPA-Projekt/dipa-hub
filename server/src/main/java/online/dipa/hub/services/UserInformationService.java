package online.dipa.hub.services;

import online.dipa.hub.api.model.User;
import org.keycloak.adapters.OidcKeycloakAccount;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;


@Service
public class UserInformationService {

    public User getUserData() {
        User currentUser = new User();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof KeycloakAuthenticationToken) {

            OidcKeycloakAccount account = ((KeycloakAuthenticationToken) authentication).getAccount();
            AccessToken token = account.getKeycloakSecurityContext().getToken();

            currentUser
                    .name(token.getName())
                    .email(token.getEmail())
                    .roles(new ArrayList<>(account.getRoles()));
        }
        return currentUser;
    }
}
