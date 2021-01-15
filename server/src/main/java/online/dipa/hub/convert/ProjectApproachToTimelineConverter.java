package online.dipa.hub.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.OperationTypeEntity;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProjectApproachToTimelineConverter implements Converter<ProjectApproachEntity, Timeline> {

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    @Override
    public Timeline convert(final ProjectApproachEntity projectApproach) {

        final OperationTypeEntity operationTypeEntity = projectApproach.getOperationType();
        
        final Long operationTypeId = projectApproach.getOperationType().getId();    

        final List<PlanTemplateEntity> planTemplateList = planTemplateRepository.findAll().stream()
                                                        .filter(template -> template.getOperationTypeEntity().getId().equals(operationTypeId))
                                                        .collect(Collectors.toList());       
        
        final List<MilestoneTemplateEntity> maxMilestoneDateList = new ArrayList<MilestoneTemplateEntity>();

        for (PlanTemplateEntity planTemplate: planTemplateList) {
                maxMilestoneDateList.add(planTemplate.getMilestones().stream()
                    .max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).get());
        }

        final MilestoneTemplateEntity maxMilestoneDate = maxMilestoneDateList
                .stream()
                .max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).get();

        return new Timeline().id(projectApproach.getId())
                             .operationTypeId(operationTypeId)
                             .projectApproachId(projectApproach.getId())
                             .start(LocalDate.now())
                             .end(LocalDate.now()
                                     .plusDays(maxMilestoneDate.getDateOffset()))
                             .defaultTimeline(operationTypeEntity.isDefaultType());
    }
}
