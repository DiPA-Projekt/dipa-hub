package online.dipa.hub.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.OperationType;
import online.dipa.hub.api.model.ProjectApproach;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.model.Timeline.ProjectTypeEnum;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.entities.OperationTypeEntity;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProjectEntityToTimelineConverter implements Converter<ProjectEntity, Timeline> {

    @Autowired
    private PlanTemplateRepository planTemplateRepository;
    
    @Autowired
    private ConversionService conversionService;

    @Override
    public Timeline convert(final ProjectEntity project) {

        final ProjectApproachEntity projectApproach = project.getProjectApproach();

        final OperationTypeEntity operationType = projectApproach.getOperationType();

        final Long operationTypeId = projectApproach.getOperationType().getId();
        
        final Optional<PlanTemplateEntity> masterPLan = planTemplateRepository.findAll().stream()
                                                        .filter(template -> filterOperationType(template, operationTypeId))
                                                        .findFirst();

        final Optional<PlanTemplateEntity> planTemplateProjectApproach = planTemplateRepository.findAll().stream()
                                                        .filter(template -> filterProjectApproach(template, projectApproach.getId()))
                                                        .filter(PlanTemplateEntity::getDefaultTemplate)
                                                        .findFirst();
        
        MilestoneTemplateEntity maxMilestoneDate;

        if (masterPLan.isPresent()) {
            maxMilestoneDate = masterPLan.get().getMilestones().stream().max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).get();
        }
        else {
            maxMilestoneDate = planTemplateProjectApproach.get().getMilestones().stream().max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).get();
        }      

        int maxMilestoneDateOffset = maxMilestoneDate.getDateOffset();
        

        Timeline timeline = new Timeline().id(project.getId())
                             .name(project.getName())
                             .operationTypeId(operationTypeId)
                             .projectApproachId(projectApproach.getId())
                             .start(LocalDate.now())
                             .end(LocalDate.now()
                                     .plusDays(maxMilestoneDateOffset))
                             .defaultTimeline(operationType.isDefaultType());

        if (project.getProjectType() != null) {
                timeline.projectType(ProjectTypeEnum.fromValue(project.getProjectType()));
        }
        
        return timeline;
    }

    private boolean filterOperationType(PlanTemplateEntity template, final Long operationTypeId) {
        Optional<OperationType> operationType = template.getOperationType().stream()
            .map(p -> conversionService.convert(p, OperationType.class))
            .filter(o -> o.getId().equals(operationTypeId)).findFirst();
        
        if (operationType.isPresent()) {
            return true;
        }
        return false;

    }
    
    private boolean filterProjectApproach(PlanTemplateEntity template, final Long projectApproachId) {
        Optional<ProjectApproach> projectApproach = template.getProjectApproach().stream()
            .map(p -> conversionService.convert(p, ProjectApproach.class))
            .filter(o -> o.getId().equals(projectApproachId)).findFirst();
        
        if (projectApproach.isPresent()) {
            return true;
        }
        return false;
    }

}
