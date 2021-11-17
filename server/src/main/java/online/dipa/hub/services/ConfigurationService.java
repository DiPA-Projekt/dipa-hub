package online.dipa.hub.services;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import online.dipa.hub.api.model.MilestoneTemplate;
import online.dipa.hub.api.model.PlanTemplate;
import online.dipa.hub.api.model.ProjectApproach;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.repositories.MilestoneTemplateRepository;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;

@Service
@Transactional
public class ConfigurationService {

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ProjectApproachService projectApproachService;

    @Autowired
    private MilestoneTemplateRepository milestoneTemplateRepository;

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    private static final String DEFAULT_MILESTONE_TEMPLATE_STATUS = "OPEN";

    public List<PlanTemplate> getPlanTemplates() {
        return planTemplateRepository.findByMaster()
                                     .stream()
                                     .map(p -> conversionService.convert(p, PlanTemplate.class))
                                     .sorted(Comparator.comparing(
                                             planTemplate -> planTemplate != null ?
                                                     planTemplate.getName().toLowerCase() :
                                                     null))
                                     .collect(Collectors.toList());
    }

    public PlanTemplate createPlanTemplate(final PlanTemplate planTemplate) {
        PlanTemplateEntity newPlanTemplate = new PlanTemplateEntity();

        newPlanTemplate.setName(planTemplate.getName());
        newPlanTemplate.setProjectApproaches(null);

        Set<ProjectApproachEntity> projectApproachEntities = new HashSet<>();

        for (ProjectApproach projectApproach : planTemplate.getProjectApproaches()) {
            projectApproachEntities.add(projectApproachService.getProjectApproachFromRepo(projectApproach.getId()));
        }

        newPlanTemplate.setProjectApproaches(projectApproachEntities);

        planTemplateRepository.save(newPlanTemplate);

        return conversionService.convert(newPlanTemplate, PlanTemplate.class);
    }

    public void deletePlanTemplate(final Long planTemplateId) {
        var planTemplateEntity = planTemplateRepository.getById(planTemplateId);

        planTemplateRepository.delete(planTemplateEntity);
    }

    public List<MilestoneTemplate> getMilestoneTemplates(final Long planTemplateId) {

        PlanTemplateEntity planTemplateEntity = planTemplateRepository.getById(planTemplateId);

        return milestoneTemplateRepository.findByPlanTemplate(planTemplateEntity)
                                     .stream()
                                     .map(p -> conversionService.convert(p, MilestoneTemplate.class))
                                     .sorted(Comparator.comparing(milestoneTemplate -> milestoneTemplate != null ?
                                             milestoneTemplate.getDateOffset() :
                                             null))
                                     .collect(Collectors.toList());
    }

    public MilestoneTemplate createMilestoneTemplate(final Long planTemplateId, final MilestoneTemplate milestoneTemplate) {

        PlanTemplateEntity planTemplateEntity = planTemplateRepository.getById(planTemplateId);

        MilestoneTemplateEntity newMilestoneTemplate = new MilestoneTemplateEntity();

        newMilestoneTemplate.setName(milestoneTemplate.getName());
        newMilestoneTemplate.setDateOffset(milestoneTemplate.getDateOffset());
        newMilestoneTemplate.setPlanTemplate(planTemplateEntity);
        newMilestoneTemplate.setStatus(DEFAULT_MILESTONE_TEMPLATE_STATUS);

        milestoneTemplateRepository.save(newMilestoneTemplate);

        return conversionService.convert(newMilestoneTemplate, MilestoneTemplate.class);
    }

    public void deleteMilestoneTemplate(final Long id) {
        var milestoneTemplateEntity = milestoneTemplateRepository.getById(id);

        milestoneTemplateRepository.delete(milestoneTemplateEntity);
    }

}
