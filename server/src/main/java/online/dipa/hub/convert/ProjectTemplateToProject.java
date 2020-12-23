// package online.dipa.hub.convert;

// import org.springframework.core.convert.converter.Converter;
// import org.springframework.stereotype.Component;

// import liquibase.hub.model.Project;
// import online.dipa.hub.api.model.ProjectApproach;
// import online.dipa.hub.api.model.ProjectType;
// import online.dipa.hub.persistence.entities.ProjectApproachEntity;
// import online.dipa.hub.persistence.entities.ProjectTypeEntity;

// @Component
// public class ProjectTemplateToProject implements Converter<ProjectTypeEntity, Project> {
//     @Override
//     public Project convert(final ProjectTypeEntity templateEntity) {
//         // final Long projectTypeId = templateEntity.getProjectType().getId();

//         return new Project().id(templateEntity.getId())
//                             .name(templateEntity.getName())
//                             .projectApproachId(templateEntity.getProjectApproach());
//     }
// }
