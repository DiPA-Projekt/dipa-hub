package online.dipa.hub.services;

import java.util.ArrayList;
import java.util.Collection;
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
import online.dipa.hub.api.model.RecurringEventType;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEventEntity;
import online.dipa.hub.persistence.entities.ProjectEventTemplateEntity;
import online.dipa.hub.persistence.entities.RecurringEventPatternEntity;
import online.dipa.hub.persistence.entities.RecurringEventTypeEntity;
import online.dipa.hub.persistence.repositories.EventRepository;
import online.dipa.hub.persistence.repositories.MilestoneTemplateRepository;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;
import online.dipa.hub.persistence.repositories.ProjectPropertyQuestionRepository;
import online.dipa.hub.persistence.repositories.RecurringEventPatternRepository;
import online.dipa.hub.persistence.repositories.RecurringEventTypeRepository;

@Service
@Transactional
public class ConfigurationService {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ProjectApproachService projectApproachService;

    @Autowired
    private MilestoneTemplateRepository milestoneTemplateRepository;

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    @Autowired
    private ProjectPropertyQuestionRepository projectPropertyQuestionRepository;

    @Autowired
    private RecurringEventTypeRepository recurringEventTypeRepository;

    @Autowired
    private RecurringEventPatternRepository recurringEventPatternRepository;

    @Autowired
    private EventRepository eventRepository;

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


    public List<RecurringEventType> getRecurringEventTypes() {
        return recurringEventTypeRepository.findByMaster()
                                           .stream()
                                           .map(p -> conversionService.convert(p, RecurringEventType.class))
                                           .sorted(Comparator.comparing(
                                                   recurringEventType -> recurringEventType != null ?
                                                           recurringEventType.getTitle().toLowerCase() :
                                                           null))
                                           .collect(Collectors.toList());
    }

    public void updateRecurringEventType (final RecurringEventType recurringEventType) {
        recurringEventTypeRepository.findById(getId(recurringEventType)).ifPresent(e -> {
            e.setTitle(recurringEventType.getTitle());
            e.setMandatory(recurringEventType.getMandatory());
            e.setPublished(false);

            if (recurringEventType.getProjectPropertyQuestionId() != null) {
                projectPropertyQuestionRepository.findById(recurringEventType.getProjectPropertyQuestionId())
                                                 .ifPresent(e::setProjectPropertyQuestion);
            }

            RecurringEventPatternEntity pattern = e.getRecurringEventPattern();
            pattern.setRulePattern(recurringEventType.getRecurringEventPattern().getRulePattern());
            recurringEventPatternRepository.save(pattern);

            recurringEventTypeRepository.save(e);
        });
    }

    public void createRecurringEventType(final RecurringEventType recurringEventType) {
        RecurringEventTypeEntity newRecurringEventType = new RecurringEventTypeEntity();

        projectPropertyQuestionRepository.findById(recurringEventType.getProjectPropertyQuestionId())
                                         .ifPresent(newRecurringEventType::setProjectPropertyQuestion);


        newRecurringEventType.setTitle(recurringEventType.getTitle());
        newRecurringEventType.setMandatory(recurringEventType.getMandatory());
        newRecurringEventType.setMaster(true);

        recurringEventTypeRepository.save(newRecurringEventType);


        RecurringEventPatternEntity newPattern = new RecurringEventPatternEntity();
        newPattern.setRulePattern(recurringEventType.getRecurringEventPattern().getRulePattern());

        newPattern.setRecurringEventType(newRecurringEventType);
        recurringEventPatternRepository.save(newPattern);

        newRecurringEventType.setRecurringEventPattern(newPattern);
    }

    public void deleteRecurringEventType(final Long recurringEventTypeId) {
        var recurringEventType = recurringEventTypeRepository.getById(recurringEventTypeId);

        recurringEventTypeRepository.delete(recurringEventType);
    }

    public void publishRecurringEventType (final Long recurringEventTypeId) {
        var masterRecurringEventType = recurringEventTypeRepository.getById(recurringEventTypeId);

        // get all recurringEventTypes with masterId = recurringEventTypeId
        Collection<RecurringEventTypeEntity> recurringEventTypes = recurringEventTypeRepository.findByMasterRecurringEventType(masterRecurringEventType);
        for (RecurringEventTypeEntity recurringEventType: recurringEventTypes) {
            // for each recurringEventType save masterRecurringEventType values
            recurringEventType.setTitle(masterRecurringEventType.getTitle());
            recurringEventType.setMandatory(masterRecurringEventType.isMandatory());
            recurringEventType.getRecurringEventPattern()
                              .setRulePattern(masterRecurringEventType.getRecurringEventPattern().getRulePattern());
            recurringEventType.setProjectPropertyQuestion(masterRecurringEventType.getProjectPropertyQuestion());

            // recalculate events
            updateRecurringEventTypeEntityEvents(recurringEventType);
        }
        masterRecurringEventType.setPublished(true);
    }

    public void updateRecurringEventTypeEntityEvents(RecurringEventTypeEntity recurringEventType) {
        RecurringEventPatternEntity recurringEventPattern = recurringEventType.getRecurringEventPattern();

        ProjectEventTemplateEntity projectEventTemplateEntity = recurringEventType.getProjectEventTemplate();

        if (projectEventTemplateEntity != null) {
            List<ProjectEventEntity> events = new ArrayList<>(projectEventTemplateEntity.getProjectEvents());
            recurringEventType.getProjectEventTemplate()
                              .getProjectEvents()
                              .removeAll(events);
            eventRepository.deleteAll(events);
            recurringEventType.setProjectEventTemplate(
                    projectService.createEventsForEventTemplate(recurringEventPattern, recurringEventType.getTitle(),
                            recurringEventType.getProjectEventTemplate(), null));
        }
    }

    private Long getId(RecurringEventType recurringEventType) {
        return recurringEventType.getId();
    }

}
