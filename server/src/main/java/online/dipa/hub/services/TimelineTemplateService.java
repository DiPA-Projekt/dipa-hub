package online.dipa.hub.services;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import online.dipa.hub.api.model.Increment;
import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.TimelineTemplate;

import online.dipa.hub.persistence.entities.IncrementEntity;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.repositories.IncrementRepository;
import online.dipa.hub.persistence.repositories.MilestoneTemplateRepository;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;
import online.dipa.hub.session.state.SessionTimelineState;

import static java.time.temporal.ChronoUnit.HOURS;

@Service
@Transactional
public class TimelineTemplateService {

    private static final String CURRENT_TEMPLATE_NAME = "aktuell";

    @Autowired
    private SessionTimelineState sessionTimelineState;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    @Autowired
    private MilestoneTemplateRepository milestoneTemplateRepository;

    @Autowired
    private MilestoneService milestoneService;
     
    @Autowired
    private IncrementService incrementService;

    @Autowired
    private IncrementRepository incrementRepository;
    
    @Autowired
    private ConversionService conversionService;
    
    public List<TimelineTemplate> getTemplatesForTimeline(final Long timelineId) {

        List<TimelineTemplate> timelineTemplates = new ArrayList<>();

        ProjectEntity currentProject = timelineService.getProject(timelineId);

        TimelineTemplate currentTimelineTemplate = this.initializeCurrentTimelineTemplate(timelineId)
                                                    .id(0L);

        timelineTemplates.add(currentTimelineTemplate);

        final ProjectApproachEntity projectApproach = currentProject.getProjectApproach();

        List<TimelineTemplate> timelineTemplatesFromRepo = getTimelineTemplatesFromRepo(timelineId, projectApproach);

        timelineTemplates.addAll(timelineTemplatesFromRepo);

        sessionTimelineState.getSessionTimelineTemplates().put(timelineId, timelineTemplates);

        return timelineTemplates;
    }

    private TimelineTemplate initializeCurrentTimelineTemplate(final Long timelineId) {

        ProjectEntity currentProject = timelineService.getProject(timelineId);

        TimelineTemplate currentTemplate = new TimelineTemplate();
        incrementService.initializeIncrements(timelineId);

        if (currentProject != null) {
                return currentTemplate
                .name(CURRENT_TEMPLATE_NAME)
                .milestones(currentProject.getPlanTemplate()
                .getMilestones().stream().map(m -> conversionService.convert(m, Milestone.class)).collect(Collectors.toList()))
                .increments(currentProject.getIncrements().stream().map(i -> conversionService.convert(i, Increment.class)).collect(Collectors.toList()));
        }

        return currentTemplate;

    }

    private List<TimelineTemplate> getTimelineTemplatesFromRepo(final Long timelineId, final ProjectApproachEntity projectApproach) {

        List<TimelineTemplate> timelineTemplatesFromRepo = new ArrayList<>();

        List<PlanTemplateEntity> projectApproachPlanTemplates = planTemplateRepository.findAll().stream()
                                                                                      .filter(template -> template.getProjectApproaches() != null)
                                                                                      .filter(template -> timelineService.filterProjectApproach(template, projectApproach.getId()))
                                                                                      .collect(Collectors.toList());

        for (PlanTemplateEntity temp: projectApproachPlanTemplates) {

            TimelineTemplate template = new TimelineTemplate()
                                .id(temp.getId())
                                .name(temp.getName())
                                .standard(temp.getStandard());

            List<MilestoneTemplateEntity> milestones = new ArrayList<>(milestoneService.getMilestonesFromTemplate(temp));

            template.milestones(updateMilestonesTimelineTemplate(timelineId, milestones, temp)
                .stream().map(m -> conversionService.convert(m, Milestone.class)).collect(Collectors.toList()));

            if (projectApproach.isIterative() && temp.getStandard()) {
                Set<IncrementEntity> increments = incrementService.createIncrementsTimelineTemplate(1,
                                        updateMilestonesTimelineTemplate(timelineId, milestones, temp));
                template.increments(increments.stream().map(i -> conversionService.convert(i, Increment.class)).collect(Collectors.toList()));
            }

            timelineTemplatesFromRepo.add(template);

        }

        return timelineTemplatesFromRepo;
    }

    public void updateTimelineTemplate(final Long timelineId, final Long templateId) {

        ProjectEntity currentProject = timelineService.getProject(timelineId);

        PlanTemplateEntity projectPlanTemplate = currentProject.getPlanTemplate();

        projectPlanTemplate.getMilestones()
                           .forEach(m -> milestoneTemplateRepository.delete(m));

        List<MilestoneTemplateEntity> newMilestones = new ArrayList<>();

        Optional<PlanTemplateEntity> selectedTemplateOptional = planTemplateRepository.findAll()
                                                .stream().filter(template -> template.getId().equals(templateId)).findFirst();

        if (selectedTemplateOptional.isPresent()) {
            projectPlanTemplate.setStandard(selectedTemplateOptional.get().getStandard());

            for (MilestoneTemplateEntity milestone: selectedTemplateOptional.get().getMilestones()) {

                MilestoneTemplateEntity newMilestone = new MilestoneTemplateEntity(milestone);
                newMilestone.setPlanTemplate(projectPlanTemplate);
                newMilestones.add(newMilestone);
            }

            newMilestones = updateMilestonesTimelineTemplate(timelineId, newMilestones, selectedTemplateOptional.get());

            milestoneTemplateRepository.saveAll(newMilestones);

            currentProject.getIncrements()
                          .forEach(i -> incrementRepository.delete(i));
        }

    }

    public List<MilestoneTemplateEntity> updateMilestonesTimelineTemplate(final Long timelineId, List<MilestoneTemplateEntity> milestones,
            PlanTemplateEntity template) {

        ProjectEntity currentProject = timelineService.getProject(timelineId);
        milestones = milestoneService.sortMilestones(milestones);
        List<MilestoneTemplateEntity> resultMilestones;

        List<MilestoneTemplateEntity> standardTemplateMilestones;

        if (currentProject.getProjectApproach().isIterative() && !template.getStandard()) {

            standardTemplateMilestones = new ArrayList<>(Objects.requireNonNull(
                planTemplateRepository.findAll()
                                      .stream()
                                      .filter(temp -> temp.getProjectApproaches() != null)
                                      .filter(temp -> timelineService.filterProjectApproach(temp,
                                              currentProject.getProjectApproach()
                                                            .getId()))
                                      .filter(PlanTemplateEntity::getStandard)
                                      .findFirst()
                                      .orElse(null))
                                                                                  .getMilestones());

            standardTemplateMilestones = milestoneService.sortMilestones(standardTemplateMilestones);
            standardTemplateMilestones.forEach(m -> m.setDate(currentProject.getStartDate().plusDays(m.getDateOffset())));

            standardTemplateMilestones = updateMilestonesPosition(standardTemplateMilestones, null, currentProject.getStartDate(), currentProject.getEndDate());
            OffsetDateTime currentStartIncrement = standardTemplateMilestones.get(1).getDate();
            OffsetDateTime currentEndIncrement = standardTemplateMilestones.get(standardTemplateMilestones.size() - 2).getDate();

            resultMilestones = updateMilestonesPosition(milestones, standardTemplateMilestones, currentStartIncrement, currentEndIncrement);

        }
        else {
            OffsetDateTime currentStartTimeline = currentProject.getStartDate();
            OffsetDateTime currentEndTimeline = currentProject.getEndDate();
            resultMilestones = updateMilestonesPosition(milestones, null, currentStartTimeline, currentEndTimeline);
        }

        return resultMilestones;
    }

    private List<MilestoneTemplateEntity> updateMilestonesPosition (List<MilestoneTemplateEntity> milestones, List<MilestoneTemplateEntity> standardTemplateMilestones,
            OffsetDateTime currentStart, OffsetDateTime currentEnd) {

        List<MilestoneTemplateEntity> milestonesResult = new ArrayList<>();
        int dateOffsetToIncrement = 0;
        OffsetDateTime initStart;

        if (standardTemplateMilestones != null) {

            List<MilestoneTemplateEntity> masterMilestones = milestones.stream().filter(
                    MilestoneTemplateEntity::getIsMaster).sorted(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).collect(
                    Collectors.toList());

            masterMilestones.get(0).setDate(standardTemplateMilestones.get(0).getDate());
            milestonesResult.add(masterMilestones.get(0));

            masterMilestones.get(masterMilestones.size() - 1).setDate(standardTemplateMilestones.get(standardTemplateMilestones.size() - 1).getDate());
            milestonesResult.add(masterMilestones.get(masterMilestones.size() - 1));

            milestones.removeIf(MilestoneTemplateEntity::getIsMaster);
            dateOffsetToIncrement = milestones.get(0).getDateOffset();
            initStart = OffsetDateTime.now().plusDays(dateOffsetToIncrement);
        }
        else {
            initStart = OffsetDateTime.now();
        }

        OffsetDateTime initEnd = OffsetDateTime.now();

        int maxDateOffset = Objects.requireNonNull(milestones
                                                        .stream()
                                                        .max(Comparator.comparing(
                                                                MilestoneTemplateEntity::getDateOffset))
                                                        .orElse(null))
                                   .getDateOffset();
        initEnd = initEnd.plusDays(maxDateOffset);


        long oldHoursBetween = HOURS.between(initStart, initEnd);
        long newHoursBetween = HOURS.between(currentStart, currentEnd);

        double factor = (double) newHoursBetween / oldHoursBetween;

        for (MilestoneTemplateEntity m : milestones) {

            long oldMilestoneRelativePosition = HOURS.between(initStart, initStart.plusDays(m.getDateOffset()).minusDays(dateOffsetToIncrement));
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            m.setDate(currentStart.plusHours(newMilestoneRelativePosition));

        }
        milestonesResult.addAll(milestones);

        return milestonesResult;
    }

}
