package online.dipa.hub.services;

import online.dipa.hub.api.model.User;
import online.dipa.hub.persistence.entities.UserGroupEntity;
import online.dipa.hub.persistence.repositories.UserGroupRepository;

import org.keycloak.adapters.OidcKeycloakAccount;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class UserInformationService {

    @Autowired
    private UserGroupRepository userGroupRepository;

    public User getUserData() {
        User currentUser = new User();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof KeycloakAuthenticationToken) {

            OidcKeycloakAccount account = ((KeycloakAuthenticationToken) authentication).getAccount();
            AccessToken token = account.getKeycloakSecurityContext().getToken();

            @SuppressWarnings("unchecked")
            List<String> groups = (List<String>) token.getOtherClaims().get("groups");
            groups.replaceAll(name -> name.substring(1));

            currentUser
                    .name(token.getName())
                    .email(token.getEmail())
                    .roles(new ArrayList<>(account.getRoles()))
                    .groups(groups)
                    .projects(getProjectIds(groups));
        }
        return currentUser;
    }

    private List<Long> getProjectIds(List<String> groups) {

        List<Long> projectIds = new ArrayList<>();

        List<UserGroupEntity> userGroups = userGroupRepository.findAll().stream()
        .filter(t -> groups.contains(String.valueOf(t.getGroupName())))
        .collect(Collectors.toList());

        userGroups.forEach(user -> projectIds.add(user.getProject().getId()));
       
        return projectIds;
    }
}
