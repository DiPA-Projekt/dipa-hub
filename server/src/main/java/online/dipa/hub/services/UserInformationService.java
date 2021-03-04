package online.dipa.hub.services;

import online.dipa.hub.api.model.User;
import org.keycloak.adapters.springsecurity.account.SimpleKeycloakAccount;
import org.keycloak.representations.AccessToken;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class UserInformationService {

    public User getUserData() {
        User currentUser = new User();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {

            List<String> roles = authentication.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            AccessToken token = ((SimpleKeycloakAccount) authentication.getDetails())
                    .getKeycloakSecurityContext()
                    .getToken();

            currentUser.name(token.getName()).email(token.getEmail()).roles(roles);
        }
        return currentUser;
    }
}
