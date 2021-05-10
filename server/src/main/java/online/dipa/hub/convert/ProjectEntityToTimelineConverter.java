package online.dipa.hub.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.model.Timeline.ProjectTypeEnum;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.entities.OperationTypeEntity;

@Component
public class ProjectEntityToTimelineConverter implements Converter<ProjectEntity, Timeline> {

    @Autowired
    protected UserEntityToUserConverter userConverter;
    
    @Override
    public Timeline convert(final ProjectEntity project) {

        final ProjectApproachEntity projectApproach = project.getProjectApproach();

        final OperationTypeEntity operationType = projectApproach.getOperationType();

        final Long operationTypeId = projectApproach.getOperationType().getId();

        Timeline timeline = new Timeline().id(project.getId())
                             .name(project.getName())
                             .operationTypeId(operationTypeId)
                             .projectApproachId(projectApproach.getId())
                             .start(project.getStartDate().toLocalDate())
                             .end(project.getEndDate().toLocalDate())
                             .defaultTimeline(operationType.isDefaultType())
                             .projectOwner(userConverter.convert(project.getUser()));

        if (project.getProjectType() != null) {
                timeline.projectType(ProjectTypeEnum.fromValue(project.getProjectType()));
        }
        
        return timeline;
    }

}