package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Project;
import online.dipa.hub.api.model.Project.ProjectTypeEnum;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;

@Component
public class ProjectEntityToProjectConverter implements Converter<ProjectEntity, Project> {

    @Override
    public Project convert(final ProjectEntity template) {
            
        final ProjectApproachEntity projectApproach = template.getProjectApproach();

        final Long operationTypeId = projectApproach.getOperationType().getId();

        Project project = new Project().id(template.getId())
                             .name(template.getName())
                             .akz(template.getAkz())
                             .client(template.getClient())
                             .department(template.getDepartment())
                             .operationTypeId(operationTypeId)
                             .projectApproachId(projectApproach.getId())
                             .start(template.getStartDate().toLocalDate())
                             .end(template.getEndDate().toLocalDate());


        if (template.getProjectSize() != null) {
            project.projectSize(Project.ProjectSizeEnum.fromValue(template.getProjectSize()));
        }

        if (project.getProjectType() != null) {
            project.projectType(ProjectTypeEnum.fromValue(template.getProjectType()));
        }

        return project;
    }

}
