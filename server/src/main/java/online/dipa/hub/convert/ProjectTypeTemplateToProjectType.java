package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.ProjectType;
import online.dipa.hub.persistence.entities.ProjectTypeEntity;

@Component
public class ProjectTypeTemplateToProjectType implements Converter<ProjectTypeEntity, ProjectType> {
    @Override
    public ProjectType convert(final ProjectTypeEntity templateEntity) {
        return new ProjectType().id(templateEntity.getId())
                              .name(templateEntity.getName());
    }
}
