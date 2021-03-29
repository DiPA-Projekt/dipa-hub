package online.dipa.hub.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.model.TimelineTemplate;
import online.dipa.hub.convert.ProjectEntityToProjectConverter;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;
import online.dipa.hub.persistence.repositories.ProjectRepository;
import online.dipa.hub.session.model.SessionTimeline;
import online.dipa.hub.session.state.SessionTimelineState;

import static java.time.temporal.ChronoUnit.DAYS;

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
    private MilestoneService milestoneService;

    @Autowired
    private ProjectRepository projectRespository;
    
    @Autowired
    private ConversionService conversionService;

    // @Autowired
    // private IncrementService incrementService;

    public List<TimelineTemplate> getTemplatesForTimeline(final Long timelineId) {

        List<TimelineTemplate> timelineTemplates = new ArrayList<>();
        // final SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines()
        //                                                     .get(timelineId);
        ProjectEntity currentProject = timelineService.getProject(timelineId);
        long count = 0;

        TimelineTemplate currentTimelineTemplate = this.initializeCurrentTimelineTemplate(timelineId)
                                                    .id(count++);

        timelineTemplates.add(currentTimelineTemplate);

        final ProjectApproachEntity projectApproach = currentProject.getProjectApproach();

        List<TimelineTemplate> timelineTemplatesFromRepo = getTimelineTemplatesFromRepo(timelineId, projectApproach, count);
        
        timelineTemplates.addAll(timelineTemplatesFromRepo);

        sessionTimelineState.getSessionTimelineTemplates().put(timelineId, timelineTemplates);

        return timelineTemplates;
    }

    private TimelineTemplate initializeCurrentTimelineTemplate(final Long timelineId) {

        ProjectEntity currentProject = timelineService.getProject(timelineId);

        TimelineTemplate currentTemplate = new TimelineTemplate();

        if (currentProject != null) {
                return currentTemplate
                .name(CURRENT_TEMPLATE_NAME)
                .milestones(currentProject.getPlanTemplate()
                .getMilestones().stream().map(m -> conversionService.convert(m, Milestone.class)).collect(Collectors.toList()));
        }

        return currentTemplate;
                // .increments(incrementService.getIncrementsForTimeline(timelineId));

    }

    private List<TimelineTemplate> getTimelineTemplatesFromRepo(final Long timelineId, final ProjectApproachEntity projectApproach, Long timelineTemplateId) {

        List<TimelineTemplate> timelineTemplatesFromRepo = new ArrayList<>();

        Long operationTypeId = projectApproach.getOperationType().getId();

        // Optional<PlanTemplateEntity> masterPlanTemplate = planTemplateRepository.findAll().stream()
        //                                                                         .filter(template -> timelineService.filterOperationType(template, operationTypeId))
        //                                                                         .findFirst();

        List<PlanTemplateEntity> projectApproachPlanTemplates = planTemplateRepository.findAll().stream()
                                                                                      .filter(template -> template.getProjectApproaches() != null)
                                                                                      .filter(template -> timelineService.filterProjectApproach(template, projectApproach.getId()))
                                                                                      .collect(Collectors.toList());

        for (PlanTemplateEntity temp: projectApproachPlanTemplates) {
            List<MilestoneTemplateEntity> milestones = new ArrayList<>();

        //     if (masterPlanTemplate.isPresent()) {
        //         milestones.addAll(milestoneService.convertMilestones(masterPlanTemplate.get()));
        //     }

            TimelineTemplate template = new TimelineTemplate()
                    .id(timelineTemplateId++)
                    .name(temp.getName())
                    .standard(temp.getStandard());

        //     if (projectApproach.isIterative()) {

        //         milestones = updateMilestonesTimelineTemplate(timelineId, milestones);
        //         List<Milestone> tempMilestones = new ArrayList<>(milestoneService.convertMilestones(temp));

        //         // timelineService.getValuesFromHashMap(milestoneService.getIncrementMilestones(tempMilestones,timelineId, 1), milestones);

        //         template.milestones(milestoneService.sortMilestones(milestones));

        //         // if (temp.getStandard()) {
        //         //     template.increments(incrementService.loadIncrementsTemplate((long) 1, 1, milestones, null));
        //         // }

        //     }
        //     else {
                milestones.addAll(milestoneService.convertMilestones(temp));
                template.milestones(updateMilestonesTimelineTemplate(timelineId, milestones));
        //     }

            timelineTemplatesFromRepo.add(template);

        }

        return timelineTemplatesFromRepo;
    }

    // public void updateTimelineTemplate(final Long timelineId, final Long templateId) {
    //     SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);

    //     List<TimelineTemplate> currentSessionTemplates = sessionTimelineState.getSessionTimelineTemplates().get(timelineId);
    //     Optional<TimelineTemplate> selectedTemplateOptional = currentSessionTemplates.stream().filter(t -> t.getId().equals(templateId)).findFirst();

    //     if (selectedTemplateOptional.isPresent()) {
            
    //         TimelineTemplate selectedTemplate = selectedTemplateOptional.get();
    //         sessionTimeline.setMilestones(selectedTemplate.getMilestones());
    //         sessionTimeline.setIncrements(selectedTemplate.getIncrements());
    //         sessionTimeline.setIterative(selectedTemplate.getIncrements() != null);

    //     }

    // }

    private List<Milestone> updateMilestonesTimelineTemplate(final Long timelineId, List<MilestoneTemplateEntity> milestones) {

        // SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);
        ProjectEntity currentProject = timelineService.getProject(timelineId);
        milestones = milestoneService.sortMilestones(milestones);

        OffsetDateTime initTimelineStart = OffsetDateTime.now();

        OffsetDateTime initTimelineEnd = OffsetDateTime.now().plusDays(currentProject.getPlanTemplate()
        .getMilestones().stream().max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).get().getDateOffset());

        System.out.println(initTimelineEnd);
        OffsetDateTime currentTimelineStart = currentProject.getStartDate();
        OffsetDateTime currentTimelineEnd = currentProject.getEndDate();

        long oldDaysBetween = DAYS.between(initTimelineStart, initTimelineEnd);
        long newDaysBetween = DAYS.between(currentTimelineStart, currentTimelineEnd);
        double factor = (double) newDaysBetween / oldDaysBetween;

        for (MilestoneTemplateEntity m : milestones) {
                System.out.println(m);
                // m.setDate(initTimelineStart.plusDays(m.getDateOffset()));
                long oldMilestoneRelativePosition = DAYS.between(initTimelineStart, initTimelineStart.plusDays(m.getDateOffset()));
                long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

                System.out.println(oldMilestoneRelativePosition);
                System.out.println(newMilestoneRelativePosition);
                m.setDate(currentTimelineStart.plusDays(newMilestoneRelativePosition));

        }

        return milestones.stream().map(m -> conversionService.convert(m, Milestone.class)).collect(Collectors.toList());
    }
}
