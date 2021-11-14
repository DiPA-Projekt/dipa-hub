package online.dipa.hub.services;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.fortuna.ical4j.model.DateList;
import net.fortuna.ical4j.model.DateTime;
import net.fortuna.ical4j.model.parameter.Value;
import net.fortuna.ical4j.model.property.RRule;
import online.dipa.hub.api.model.FinalProjectTask;
import online.dipa.hub.api.model.FormField;
import online.dipa.hub.api.model.MilestoneTemplate;
import online.dipa.hub.api.model.NonPermanentProjectTask;
import online.dipa.hub.api.model.PermanentProjectTask;
import online.dipa.hub.api.model.PlanTemplate;
import online.dipa.hub.api.model.Project;
import online.dipa.hub.api.model.ProjectApproach;
import online.dipa.hub.api.model.ProjectEvent;
import online.dipa.hub.api.model.ProjectEventTemplate;
import online.dipa.hub.api.model.ProjectRole;
import online.dipa.hub.api.model.ProjectTask;
import online.dipa.hub.api.model.PropertyQuestion;
import online.dipa.hub.api.model.Result;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.model.User;
import online.dipa.hub.persistence.entities.BaseEntity;
import online.dipa.hub.persistence.entities.FinalProjectTaskEntity;
import online.dipa.hub.persistence.entities.FinalProjectTaskTemplateEntity;
import online.dipa.hub.persistence.entities.FormFieldEntity;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.NonPermanentProjectTaskEntity;
import online.dipa.hub.persistence.entities.NonPermanentProjectTaskTemplateEntity;
import online.dipa.hub.persistence.entities.OptionEntryEntity;
import online.dipa.hub.persistence.entities.PermanentProjectTaskEntity;
import online.dipa.hub.persistence.entities.PermanentProjectTaskTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.entities.ProjectEventEntity;
import online.dipa.hub.persistence.entities.ProjectEventTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectPropertyQuestionEntity;
import online.dipa.hub.persistence.entities.ProjectPropertyQuestionTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectTaskEntity;
import online.dipa.hub.persistence.entities.ProjectTaskTemplateEntity;
import online.dipa.hub.persistence.entities.RecurringEventPatternEntity;
import online.dipa.hub.persistence.entities.RecurringEventTypeEntity;
import online.dipa.hub.persistence.entities.ResultEntity;
import online.dipa.hub.persistence.repositories.EventRepository;
import online.dipa.hub.persistence.repositories.EventTemplateRepository;
import online.dipa.hub.persistence.repositories.FinalProjectTaskRepository;
import online.dipa.hub.persistence.repositories.FinalProjectTaskTemplateRepository;
import online.dipa.hub.persistence.repositories.FormFieldRepository;
import online.dipa.hub.persistence.repositories.MilestoneTemplateRepository;
import online.dipa.hub.persistence.repositories.NonPermanentProjectTaskRepository;
import online.dipa.hub.persistence.repositories.NonPermanentProjectTaskTemplateRepository;
import online.dipa.hub.persistence.repositories.OptionEntryEntityRepository;
import online.dipa.hub.persistence.repositories.PermanentProjectTaskRepository;
import online.dipa.hub.persistence.repositories.PermanentProjectTaskTemplateRepository;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;
import online.dipa.hub.persistence.repositories.ProjectPropertyQuestionRepository;
import online.dipa.hub.persistence.repositories.ProjectPropertyQuestionTemplateRepository;
import online.dipa.hub.persistence.repositories.ProjectRepository;
import online.dipa.hub.persistence.repositories.ProjectTaskRepository;
import online.dipa.hub.persistence.repositories.ProjectTaskTemplateRepository;
import online.dipa.hub.persistence.repositories.RecurringEventPatternRepository;
import online.dipa.hub.persistence.repositories.RecurringEventTypeRepository;
import online.dipa.hub.persistence.repositories.ResultRepository;
import online.dipa.hub.persistence.repositories.UserRepository;
import online.dipa.hub.tenancy.CurrentTenantContextHolder;

@Service
@Transactional
public class ConfigurationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ConfigurationService.class);

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
