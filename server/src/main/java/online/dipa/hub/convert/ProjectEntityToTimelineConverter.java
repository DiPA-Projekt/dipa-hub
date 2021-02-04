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

        final List<PlanTemplateEntity> planTemplateList = planTemplateRepository.findAll().stream()
                                                        // .filter(template -> getProjectApproach(template, projectApproach.getId()))
                                                        .filter(PlanTemplateEntity::getDefaultTemplate)
                                                        .collect(Collectors.toList());       
        
        final List<MilestoneTemplateEntity> maxMilestoneDateList = new ArrayList<>();

        for (PlanTemplateEntity planTemplate: planTemplateList) {
                planTemplate.getMilestones().stream()
                    .max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).ifPresent(maxMilestoneDateList::add);
        }

        final MilestoneTemplateEntity maxMilestoneDate = maxMilestoneDateList
                .stream()
                .max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).orElse(null);

        int maxMilestoneDateOffset = 0;
        if (maxMilestoneDate != null) {
            maxMilestoneDateOffset = maxMilestoneDate.getDateOffset();
        }

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

    private boolean getOperationType(PlanTemplateEntity template, final Long operationTypeId) {
        Optional<OperationType> operationType = template.getOperationType().stream()
            .map(p -> conversionService.convert(p, OperationType.class))
            .filter(o -> o.getId().equals(operationTypeId)).findFirst();
        
        if (operationType.isPresent()) {
            return true;
        }
        return false;

    }
    
    private boolean getProjectApproach(PlanTemplateEntity template, final Long projectApproachId) {
        Optional<ProjectApproach> projectApproach = template.getProjectApproach().stream()
            .map(p -> conversionService.convert(p, ProjectApproach.class))
            .filter(o -> o.getId().equals(projectApproachId)).findFirst();
        System.out.println(projectApproach);
        
        if (projectApproach.isPresent()) {
            return true;
        }
        return false;

    }

}
