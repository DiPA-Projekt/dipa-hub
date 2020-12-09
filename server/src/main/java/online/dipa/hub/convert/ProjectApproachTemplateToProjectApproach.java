package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.ProjectApproach;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;

@Component
public class ProjectApproachTemplateToProjectApproach implements Converter<ProjectApproachEntity, ProjectApproach> {
    @Override
    public ProjectApproach convert(final ProjectApproachEntity templateEntity) {
        final Long projectTypeId = templateEntity.getProjectType().getId();

        return new ProjectApproach().id(templateEntity.getId())
                              .name(templateEntity.getName())
                              .projectTypeId(projectTypeId);
    }
}
