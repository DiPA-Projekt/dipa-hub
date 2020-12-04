package online.dipa.hub.convert;

import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.persistence.entities.ProjectTypeEntity;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.Set;

@Component
public class ProjectTypeToTimelineConverter implements Converter<ProjectTypeEntity, Timeline> {
    @Override
    public Timeline convert(final ProjectTypeEntity projectTypeEntity) {

        // MilestoneTemplateEntity maxMilestoneDate = projectTypeEntity.getMilestones()
        //         .stream()
        //         .max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).get();

        return new Timeline().id(projectTypeEntity.getId())
                             .name(projectTypeEntity.getName())
                             .start(LocalDate.now())
                            //  .end(LocalDate.now()
                            //          .plusDays(maxMilestoneDate.getDateOffset()))
                             .defaultTimeline(projectTypeEntity.isDefaultType());
    }
}
