package online.dipa.hub.services;

import java.util.Collection;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;

import online.dipa.hub.api.model.ProjectRole;

@Service
public class SecurityService {

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private UserInformationService userInformationService;

    public boolean isProjectMemberAndHasRole (final Long projectId, final Collection<String> roles) {
        Optional<ProjectRole> optionalProjectRole = Optional.empty();
        if (userInformationService.getUserData().getProjectRoles() != null) {

            optionalProjectRole = userInformationService.getUserData().getProjectRoles()
                                                       .stream()
                                                       .filter(p -> p.getProjectId().equals(projectId))
                                                       .filter(r -> roles.contains(r.getAbbreviation())).findFirst();

        }
        return optionalProjectRole.isPresent();
    }

    public boolean isProjectMember (final Long projectId) {
        Optional<ProjectRole> optionalProjectRole = Optional.empty();
        if (userInformationService.getUserData().getProjectRoles() != null) {

            optionalProjectRole = userInformationService.getUserData().getProjectRoles()
                                                        .stream()
                                                        .filter(p -> p.getProjectId().equals(projectId)).findFirst();

        }
        return optionalProjectRole.isPresent();
    }

}
