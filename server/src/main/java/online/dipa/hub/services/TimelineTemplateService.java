package online.dipa.hub.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.SessionScope;

import online.dipa.hub.state.SessionState;
import online.dipa.hub.state.TimelineState;
import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.TimelineTemplate;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
@SessionScope
@Transactional
public class TimelineTemplateService {

    private static final String CURRENT_TEMPLATE_NAME = "aktuell";

    @Autowired
    private SessionState sessionState;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    @Autowired
    private MilestoneService milestoneService;

    @Autowired
    private IncrementService incrementService;

    public List<TimelineTemplate> getTemplatesForTimeline(final Long timelineId) {

        List<TimelineTemplate> timelineTemplates = new ArrayList<>();
        final TimelineState sessionTimeline = sessionState.getSessionTimelines()
                                                            .get(timelineId);
        long count = 0;

        TimelineTemplate currentTimelineTemplate = this.initializeCurrentTimelineTemplate(timelineId)
                                                    .id(count++);

        timelineTemplates.add(currentTimelineTemplate);

        final ProjectApproachEntity projectApproach = timelineService.findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());

        List<TimelineTemplate> timelineTemplatesFromRepo = getTimelineTemplatesFromRepo(timelineId, projectApproach, count);
        
        timelineTemplates.addAll(timelineTemplatesFromRepo);

        sessionState.getSessionTimelineTemplates().put(timelineId, timelineTemplates);

        return timelineTemplates;
    }

    private TimelineTemplate initializeCurrentTimelineTemplate(final Long timelineId) {

        return new TimelineTemplate()
                .name(CURRENT_TEMPLATE_NAME)
                .milestones(milestoneService.getMilestonesForTimeline(timelineId))
                .increments(incrementService.getIncrementsForTimeline(timelineId));

    }

    private List<TimelineTemplate> getTimelineTemplatesFromRepo(final Long timelineId, final ProjectApproachEntity projectApproach, Long timelineTemplateId) {

        List<TimelineTemplate> timelineTemplatesFromRepo = new ArrayList<>();

        Long operationTypeId = projectApproach.getOperationType().getId();

        Optional<PlanTemplateEntity> masterPlanTemplate = planTemplateRepository.findAll().stream()
                                                                                .filter(template -> timelineService.filterOperationType(template, operationTypeId))
                                                                                .findFirst();

        List<PlanTemplateEntity> projectApproachPlanTemplates = planTemplateRepository.findAll().stream()
                                                                                      .filter(template -> template.getProjectApproaches() != null)
                                                                                      .filter(template -> timelineService.filterProjectApproach(template, projectApproach.getId()))
                                                                                      .collect(Collectors.toList());

        for (PlanTemplateEntity temp: projectApproachPlanTemplates) {
            List<Milestone> milestones = new ArrayList<>();

            if (masterPlanTemplate.isPresent()) {
                milestones.addAll(milestoneService.convertMilestones(masterPlanTemplate.get()));
            }

            TimelineTemplate template = new TimelineTemplate()
                    .id(timelineTemplateId++)
                    .name(temp.getName())
                    .standard(temp.getStandard());

            if (projectApproach.isIterative()) {

                milestones = updateMilestonesTimelineTemplate(timelineId, milestones);
                List<Milestone> tempMilestones = new ArrayList<>(milestoneService.convertMilestones(temp));

                timelineService.getValuesFromHashMap(milestoneService.getIncrementMilestones(tempMilestones,timelineId, 1), milestones);

                template.milestones(milestoneService.sortMilestones(milestones));

                if (temp.getStandard()) {
                    template.increments(incrementService.loadIncrementsTemplate((long) 1, 1, milestones, null));
                }

            }
            else {
                milestones.addAll(milestoneService.convertMilestones(temp));
                template.milestones(updateMilestonesTimelineTemplate(timelineId, milestones));
            }

            timelineTemplatesFromRepo.add(template);

        }

        return timelineTemplatesFromRepo;
    }

    public void updateTimelineTemplate(final Long timelineId, final Long templateId) {
        TimelineState sessionTimeline = sessionState.getSessionTimelines().get(timelineId);

        List<TimelineTemplate> currentSessionTemplates = sessionState.getSessionTimelineTemplates().get(timelineId);
        Optional<TimelineTemplate> selectedTemplateOptional = currentSessionTemplates.stream().filter(t -> t.getId().equals(templateId)).findFirst();

        if (selectedTemplateOptional.isPresent()) {
            
            TimelineTemplate selectedTemplate = selectedTemplateOptional.get();
            sessionTimeline.setMilestones(selectedTemplate.getMilestones());
            sessionTimeline.setIncrements(selectedTemplate.getIncrements());
            sessionTimeline.setIterative(selectedTemplate.getIncrements() != null);

        }

    }

    private List<Milestone> updateMilestonesTimelineTemplate(final Long timelineId, List<Milestone> milestones) {

        TimelineState sessionTimeline = sessionState.getSessionTimelines().get(timelineId);
        milestones = milestoneService.sortMilestones(milestones);

        LocalDate initTimelineStart = LocalDate.now();

        Optional<LocalDate> initTimelineEndOptional = milestones.stream().map(Milestone::getDate).max(LocalDate::compareTo);

        LocalDate initTimelineEnd;

        if (initTimelineEndOptional.isPresent()) {
            initTimelineEnd = initTimelineEndOptional.get();

            LocalDate currentTimelineStart = sessionTimeline.getTimeline().getStart();
            LocalDate currentTimelineEnd = sessionTimeline.getTimeline().getEnd();

            long oldDaysBetween = DAYS.between(initTimelineStart, initTimelineEnd);
            long newDaysBetween = DAYS.between(currentTimelineStart, currentTimelineEnd);
            double factor = (double) newDaysBetween / oldDaysBetween;

            for (Milestone m : milestones) {
                long oldMilestoneRelativePosition = DAYS.between(initTimelineStart, m.getDate());
                long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

                m.setDate(currentTimelineStart.plusDays(newMilestoneRelativePosition));

            }
        }

        return milestones;
    }
}
