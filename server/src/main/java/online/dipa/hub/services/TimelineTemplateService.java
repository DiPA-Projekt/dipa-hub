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
        long count = 0;

        TimelineTemplate currentTimelineTemplate = this.initializeCurrentTimelineTemplate(timelineId)
                                                    .id(count++);

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
                Set<IncrementEntity> increments = incrementService.createIncrementsTimelineTemplate(timelineId, 1,
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

    public List<MilestoneTemplateEntity> updateMilestonesTimelineTemplate(final Long timelineId, List<MilestoneTemplateEntity> milestones, PlanTemplateEntity template) {

        ProjectEntity currentProject = timelineService.getProject(timelineId);
        milestones = milestoneService.sortMilestones(milestones);

        OffsetDateTime initTimelineStart = OffsetDateTime.now();
        Optional<MilestoneTemplateEntity> maxDateOffset = milestones.stream()
                                                                    .max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset));
        OffsetDateTime initTimelineEnd = OffsetDateTime.now();

        if (maxDateOffset.isPresent()) {
            initTimelineEnd = initTimelineEnd.plusDays(maxDateOffset.get().getDateOffset());
        }
//
//        if (currentProject.getProjectApproach().isIterative() && !template.getStandard()) {
//
//            List<MilestoneTemplateEntity> standardMilestones = new ArrayList<>(Objects.requireNonNull(
//                    planTemplateRepository.findAll()
//                                          .stream()
//                                          .filter(temp -> temp.getProjectApproaches() != null)
//                                          .filter(temp -> timelineService.filterProjectApproach(temp,
//                                                  currentProject.getProjectApproach()
//                                                                .getId()))
//                                          .filter(PlanTemplateEntity::getStandard)
//                                          .findFirst()
//                                          .orElse(null))
//                                                                                      .getMilestones());
//            standardMilestones.removeIf(MilestoneTemplateEntity::getIsMaster);
//            standardMilestones = milestoneService.sortMilestones(standardMilestones);
//
//            currentTimelineStart = OffsetDateTime.now().plusDays(standardMilestones.get(0).getDateOffset());
//            currentTimelineEnd = OffsetDateTime.now().plusDays(standardMilestones.get(standardMilestones.size() - 1).getDateOffset());
//        }
//        else {
        OffsetDateTime currentTimelineStart = currentProject.getStartDate();
        OffsetDateTime currentTimelineEnd = currentProject.getEndDate();


        long oldHoursBetween = HOURS.between(initTimelineStart, initTimelineEnd);
        long newHoursBetween = HOURS.between(currentTimelineStart, currentTimelineEnd);
        double factor = (double) newHoursBetween / oldHoursBetween;

        for (MilestoneTemplateEntity m : milestones) {

            long oldMilestoneRelativePosition = HOURS.between(initTimelineStart, initTimelineStart.plusDays(m.getDateOffset()));
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            m.setDate(currentTimelineStart.plusHours(newMilestoneRelativePosition));

        }

        return milestones;
    }

}
