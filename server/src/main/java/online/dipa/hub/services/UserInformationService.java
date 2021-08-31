package online.dipa.hub.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import online.dipa.hub.api.model.ProjectRole;
import online.dipa.hub.api.model.User;
import online.dipa.hub.persistence.entities.BaseEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.entities.ProjectRoleEntity;
import online.dipa.hub.persistence.entities.ProjectRoleTemplateEntity;
import online.dipa.hub.persistence.entities.UserEntity;
import online.dipa.hub.persistence.repositories.ProjectRepository;
import online.dipa.hub.persistence.repositories.ProjectRoleRepository;
import online.dipa.hub.persistence.repositories.ProjectRoleTemplateRepository;
import online.dipa.hub.persistence.repositories.UserRepository;
import online.dipa.hub.security.DipaKeycloakAuthenticationToken;

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
        final Authentication authentication = SecurityContextHolder.getContext()
                                                                   .getAuthentication();
        if (authentication instanceof DipaKeycloakAuthenticationToken) {
            final DipaKeycloakAuthenticationToken authToken = (DipaKeycloakAuthenticationToken) authentication;
            final UserEntity userEntity = userRepository.findById(authToken.getUserEntityId())
                                                        .orElseThrow();

            return conversionService.convert(userEntity, User.class);
        }
        throw new IllegalStateException("Not correctly authenticated user shall never reach this point.");
    }

    public List<User> getAllUsers() {
        final String currentTenantId = currentTenantIdentifierResolver.resolveCurrentTenantIdentifier();

        return userRepository.findAll()
                             .stream()
                             .filter(u -> u.getTenantId()
                                           .equals(currentTenantId))
                             .map(user -> conversionService.convert(user, User.class))
                             .collect(Collectors.toList());
    }

    public void createNewProjectRoles(final ProjectEntity project, final User projectOwner) {
        final ProjectRoleTemplateEntity pRoleTemplate = findProjectRoleTemplate(project);

        final var newPRoleTemplate = new ProjectRoleTemplateEntity();
        newPRoleTemplate.setName(project.getName() + "ProjectRoleTemplate");
        newPRoleTemplate.setProject(project);

        projectRoleTemplateRepository.save(newPRoleTemplate);
        project.setProjectRoleTemplate(newPRoleTemplate);
        projectRepository.save(project);

        final Set<ProjectRoleEntity> pRoles = new HashSet<>();
        for (final ProjectRoleEntity pRole : new ArrayList<>(Objects.requireNonNull(pRoleTemplate)
                                                                    .getProjectRoles())) {

            final var newPRole = new ProjectRoleEntity(pRole);
            newPRole.setProjectRoleTemplate(newPRoleTemplate);
            projectRoleRepository.save(newPRole);
            pRoles.add(newPRole);
        }

        newPRoleTemplate.setProjectRoles(pRoles);
        projectRoleTemplateRepository.save(newPRoleTemplate);

        Optional<ProjectRoleEntity> projectRolePE = projectRoleRepository.findByTemplateAndAbbreviation(newPRoleTemplate, "PE");

        projectRolePE.ifPresent(projectRole -> userRepository.findById(projectOwner.getId())
                                                                    .ifPresent(user -> {
                                                                        user.getProjectRoles()
                                                                            .add(projectRole);
                                                                        userRepository.save(user);
                                                                    }));

    }

    public void updateNewProjectRolesForTemplate (final ProjectEntity project) {

        final ProjectRoleTemplateEntity pRoleTemplate = findProjectRoleTemplate(project);

        final Set<ProjectRoleEntity> newProjectRoles = new HashSet<>();

        for (final ProjectRoleEntity projectRole: new ArrayList<>(Objects.requireNonNull(pRoleTemplate)
                                                                         .getProjectRoles())) {
            final var newPRole = new ProjectRoleEntity(projectRole);
            projectRoleRepository.save(newPRole);
            newProjectRoles.add(newPRole);
        }

        for (final ProjectRoleEntity projectRole: project.getProjectRoleTemplate().getProjectRoles()) {
            for (final UserEntity user: new ArrayList<>(projectRole.getUsers())) {
                user.getProjectRoles()
                    .remove(projectRole);

                final Optional<ProjectRoleEntity> userRoleOptional = newProjectRoles.stream()
                                                                                    .filter(r -> r.getAbbreviation()
                                                                                                  .equals(projectRole.getAbbreviation()))
                                                                                    .findFirst();
                if (userRoleOptional.isPresent()) {
                    user.getProjectRoles()
                        .add(userRoleOptional.get());

                } else {
                    newProjectRoles.stream()
                                   .filter(ProjectRoleEntity::isDefaultRole)
                                   .findFirst()
                                   .ifPresent(member -> user.getProjectRoles()
                                                            .add(member));
                }

            }
            projectRoleRepository.delete(projectRole);
        }
        newProjectRoles.forEach(role -> role.setProjectRoleTemplate(project.getProjectRoleTemplate()));

        project.getProjectRoleTemplate()
               .setProjectRoles(newProjectRoles);
        projectRoleTemplateRepository.save(project.getProjectRoleTemplate());
    }

    public List<Long> getProjectIdList() {
        List<Long> projectIdsList = new ArrayList<>();
    
        if (getUserData().getOrganisationRoles() != null && getUserData().getOrganisationRoles()
                                                                         .stream()
                                                                         .anyMatch(o -> o.getAbbreviation()
                                                                                         .equals("PMO"))){
            projectIdsList = projectRepository.findAll()
                                              .stream()
                                              .map(BaseEntity::getId)
                                              .collect(Collectors.toList());
        }
        else if (getUserData().getProjectRoles() != null) {
            projectIdsList = getUserData().getProjectRoles()
                                          .stream()
                                          .map(ProjectRole::getProjectId)
                                          .collect(Collectors.toList());
        }

        return projectIdsList;
    }

    public void updateUser (final User user) {

        Optional<UserEntity> optionalUser = userRepository.findById(user.getId());

        if (optionalUser.isPresent()) {

            UserEntity userEntity = optionalUser.get();
            List<ProjectRoleEntity> oldUserProjectRoles = new ArrayList<>(Objects.requireNonNull(userEntity)
                                                                                 .getProjectRoles());
            userEntity.getProjectRoles()
                      .removeAll(oldUserProjectRoles);

            for (final ProjectRole projectRole: user.getProjectRoles()) {

                projectRoleRepository.findById(projectRole.getId())
                                     .ifPresent(newPRoleEntity -> userEntity.getProjectRoles()
                                                                            .add(newPRoleEntity));

            }
            userRepository.save(userEntity);
        }
        

    }

    private ProjectRoleTemplateEntity findProjectRoleTemplate (final ProjectEntity project) {

        return project.getProjectApproach()
                      .getProjectRoleTemplate();
    }
}
