package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Project;

import online.dipa.hub.persistence.entities.ProjectEntity;

@Component
public class ProjectEntityToProjectConverter implements Converter<ProjectEntity, Project> {

    @Override
    public Project convert(final ProjectEntity template) {

        Project project = new Project().id(template.getId())
                             .name(template.getName())
                             .akz(template.getAKZ())
                             .client(template.getClient())
                             .department(template.getDepartment())
                             .projectOwner(template.getProjectOwner());


        if (template.getProjectSize() != null) {
            project.projectSize(Project.ProjectSizeEnum.fromValue(template.getProjectSize()));
        }
        return project;
    }

}
