package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.ProjectRole;
import online.dipa.hub.persistence.entities.ProjectRoleEntity;

@Component
public class ProjectRoleEntityToProjectConverter implements Converter<ProjectRoleEntity, ProjectRole> {

    @Override
    public ProjectRole convert(final ProjectRoleEntity template) {

        return new ProjectRole().id(template.getId())
                             .name(template.getName())
                             .abbreviation(template.getAbbreviation())
                             .permission(ProjectRole.PermissionEnum.fromValue(template.getPermission()))
                             .projectId(template.getProjectRoleTemplate().getProject().getId());
                
    }

}
