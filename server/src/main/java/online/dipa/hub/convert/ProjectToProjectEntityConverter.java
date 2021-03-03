package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Project;

import online.dipa.hub.persistence.entities.ProjectEntity;

@Component
public class ProjectToProjectEntityConverter implements Converter<Project, ProjectEntity> {


    @Override
    public ProjectEntity convert(final Project project) {


        ProjectEntity projectEntity = new ProjectEntity();
        projectEntity.setId(project.getId());
                             projectEntity.setName(project.getName());
                             projectEntity.setAkz(project.getAkz());
                             projectEntity.setClient(project.getClient());
                             projectEntity.setDepartment(project.getDepartment());
                             projectEntity.setProjectOwner(project.getProjectOwner());
      
        return projectEntity;
    }

}
