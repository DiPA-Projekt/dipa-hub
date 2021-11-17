package online.dipa.hub.convert;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.MilestoneTemplate;
import online.dipa.hub.api.model.PlanTemplate;
import online.dipa.hub.api.model.ProjectApproach;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;

@Component
public class PlanTemplateEntityToPlanTemplateConverter implements Converter<PlanTemplateEntity, PlanTemplate> {

    @Autowired
    protected MilestoneTemplateEntityToMilestoneTemplateConverter milestoneTemplateEntityToMilestoneTemplateConverter;

    @Autowired
    protected ProjectApproachTemplateToProjectApproach projectApproachTemplateToProjectApproachConverter;

    @Override
    public PlanTemplate convert(final PlanTemplateEntity templateEntity) {

        List<MilestoneTemplate> milestoneTemplates = templateEntity.getMilestones().stream()
                                          .map(p -> milestoneTemplateEntityToMilestoneTemplateConverter.convert(p))
                                          .sorted(Comparator.comparing(milestone -> milestone != null ? milestone.getDateOffset() : null))
                                          .collect(
                                                  Collectors.toList());


        List<ProjectApproach> projectApproaches = templateEntity.getProjectApproaches().stream()
                                                                   .map(p -> projectApproachTemplateToProjectApproachConverter.convert(p))
                                                                   .sorted(Comparator.comparing(projectApproach -> projectApproach != null ? projectApproach.getName() : null))
                                                                   .collect(
                                                                           Collectors.toList());

        return new PlanTemplate().id(templateEntity.getId())
                            .name(templateEntity.getName())
                            .milestoneTemplates(milestoneTemplates)
                            .projectApproaches(projectApproaches)
                            .standard(templateEntity.getStandard())
                            ._default(templateEntity.getDefaultTemplate());
    }
}
