package online.dipa.hub.mapper;

import org.mapstruct.*;

import online.dipa.hub.api.model.Project;

import online.dipa.hub.persistence.entities.ProjectEntity;

@Mapper(componentModel = "spring")
public interface ProjectProjectEntityMapper {

    void updateProjectEntity(Project project, @MappingTarget ProjectEntity entity);


}

