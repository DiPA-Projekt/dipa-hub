package online.dipa.hub.services;

import online.dipa.hub.api.model.ProjectRole;
import online.dipa.hub.api.model.User;
import online.dipa.hub.persistence.entities.*;
import online.dipa.hub.persistence.repositories.*;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.keycloak.adapters.OidcKeycloakAccount;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.Set;

@Service
public class UserInformationService {

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectRoleRepository projectRoleRepository;
    
    @Autowired
    private ProjectRoleTemplateRepository projectRoleTemplateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CurrentTenantIdentifierResolver currentTenantIdentifierResolver;

    public User getUserData() {

        User currentUser = new User();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof KeycloakAuthenticationToken) {

            OidcKeycloakAccount account = ((KeycloakAuthenticationToken) authentication).getAccount();

            String currentUserKeycloakId = account.getKeycloakSecurityContext().getToken().getSubject().intern();

            currentUser = userRepository.findAll().stream()
            .filter(user -> user.getKeycloakId().equals(currentUserKeycloakId))
            .map(u -> conversionService.convert(u, User.class)).findFirst().orElse(null);

        }
        return currentUser;
    }

    public List<User> getAllUsers() {
        String currentTenantId = currentTenantIdentifierResolver.resolveCurrentTenantIdentifier();

        return userRepository.findAll().stream().filter(u -> u.getTenantId().equals(currentTenantId))
        .map(user -> conversionService.convert(user, User.class)).collect(Collectors.toList());
    }

    public void createNewProjectRoles (ProjectEntity project) {

        ProjectRoleTemplateEntity pRoleTemplate = projectRoleTemplateRepository.findAll().stream()
                                                                               .filter(temp -> temp.getProjectApproaches().stream()
                                                                                                   .anyMatch(a -> a.getId().equals(project.getProjectApproach().getId()))).findFirst()
                                                                               .orElse(null);

        var newPRoleTemplate = new ProjectRoleTemplateEntity();
        newPRoleTemplate.setName(project.getName() + "ProjectRoleTemplate");
        newPRoleTemplate.setProject(project);

        projectRoleTemplateRepository.save(newPRoleTemplate);
        project.setProjectRoleTemplate(newPRoleTemplate);
        projectRepository.save(project);

        Set<ProjectRoleEntity> pRoles = new HashSet<>();
        for (ProjectRoleEntity pRole: new ArrayList<>(Objects.requireNonNull(pRoleTemplate)
                                                             .getProjectRoles())) {

            var newPRole = new ProjectRoleEntity(pRole);
            newPRole.setProjectRoleTemplate(newPRoleTemplate);
            projectRoleRepository.save(newPRole);
            pRoles.add(newPRole);
        }

        newPRoleTemplate.setProjectRoles(pRoles);
        projectRoleTemplateRepository.save(newPRoleTemplate);

    }

    public List<Long> getProjectIdList() {
        List<Long> projectIdsList = new ArrayList<>();
    
        if (getUserData().getOrganisationRoles() != null && getUserData().getOrganisationRoles()
                         .stream()
                         .anyMatch(o -> o.getAbbreviation()
                                         .equals("PMO"))){
            projectIdsList = projectRepository.findAll()
                                    .stream().map(BaseEntity::getId).collect(Collectors.toList());
        }
        else if(getUserData().getProjectRoles() !=null) {

            List<Long> projectRoleProjects = getUserData().getProjectRoles().stream().map(ProjectRole::getProjectId).collect(Collectors.toList());
            projectRoleProjects.addAll(getProjectOwnerProjects());
            projectIdsList = projectRoleProjects;
        }

        return projectIdsList;
    }

    private List<Long> getProjectOwnerProjects()  {
        return projectRepository.findAll().stream().filter(p -> p.getUser().getId().equals(getUserData().getId())).map(
                ProjectEntity::getId).collect(Collectors.toList());
    }

    public void updateUser (User user) {

        var userEntity = userRepository.findAll().stream().filter(u -> u.getId().equals(user.getId()))
                                       .findFirst().orElse(null);
        
        List<ProjectRoleEntity> oldUserProjectRoles = new ArrayList<>(Objects.requireNonNull(userEntity)
                                                                             .getProjectRoles());
        userEntity.getProjectRoles().removeAll(oldUserProjectRoles);      

        for (ProjectRole projectRole: user.getProjectRoles()) {

            ProjectRoleEntity newPRoleEntity = projectRoleRepository.findAll().stream()
            .filter(role -> role.getId().equals(projectRole.getId())).findFirst().orElse(null);
       
            userEntity.getProjectRoles().add(newPRoleEntity);
        }
        userRepository.save(userEntity);
    }


}
