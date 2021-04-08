package online.dipa.hub.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.OperationType;
import online.dipa.hub.api.model.ProjectApproach;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.model.Timeline.ProjectTypeEnum;
import online.dipa.hub.mapper.ProjectProjectEntityMapper;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.entities.OperationTypeEntity;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;

import java.util.Objects;
import java.util.Optional;

@Component
public class ProjectEntityToTimelineConverter implements Converter<ProjectEntity, Timeline> {

    @Autowired
    private OperationTypeTemplateToOperationType operationConverter;

    @Autowired
    private ProjectApproachTemplateToProjectApproach projectApproachConverter;

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    @Autowired
    private ProjectProjectEntityMapper projectEntityMapper;

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
                             .defaultTimeline(operationType.isDefaultType());

        if (project.getProjectType() != null) {
                timeline.projectType(ProjectTypeEnum.fromValue(project.getProjectType()));
        }
        
        return timeline;
    }

    private boolean filterOperationType(PlanTemplateEntity template, final Long operationTypeId) {
        Optional<OperationType> operationType = template.getOperationTypes()
                                                        .stream()
                                                        .map(p -> operationConverter.convert(p))
                                                        .filter(Objects::nonNull)
                                                        .filter(o -> o.getId().equals(operationTypeId)).findFirst();
        
        return operationType.isPresent();
    }
    
    private boolean filterProjectApproach(PlanTemplateEntity template, final Long projectApproachId) {
        Optional<ProjectApproach> projectApproach = template.getProjectApproaches()
                                                            .stream()
                                                            .map(p -> projectApproachConverter.convert(p))
                                                            .filter(Objects::nonNull)
                                                            .filter(o -> o.getId().equals(projectApproachId)).findFirst();
        
        return projectApproach.isPresent();
    }

}