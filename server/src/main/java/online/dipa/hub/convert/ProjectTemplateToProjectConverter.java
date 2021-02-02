package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Project;

import online.dipa.hub.persistence.entities.ProjectEntity;

@Component
public class ProjectTemplateToProjectConverter implements Converter<ProjectEntity, Project> {

    @Override
    public Project convert(final ProjectEntity template) {

        Project project = new Project().id(template.getId())
                             .name(template.getName())
                             .projectSize(Project.ProjectSizeEnum.fromValue(template.getProjectSize()))
                             .AKZ(template.getAKZ())
                             .client(template.getClient())
                             .department(template.getDepartment())
                             .projectOwner(template.getProjectOwner());
        
        return project;
    }
}
