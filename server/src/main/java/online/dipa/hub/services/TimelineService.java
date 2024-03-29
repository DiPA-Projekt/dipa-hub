package online.dipa.hub.services;

import net.fortuna.ical4j.model.TimeZone;
import online.dipa.hub.IcsCalendar;
import online.dipa.hub.api.model.*;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.time.temporal.ChronoUnit.DAYS;
import static java.time.temporal.ChronoUnit.HOURS;

import static online.dipa.hub.api.model.Timeline.ProjectTypeEnum;

@Service
@Transactional
public class TimelineService {

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private MilestoneTemplateRepository milestoneTemplateRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private IncrementRepository incrementRepository;

    @Autowired
    private MilestoneService milestoneService;

    @Autowired
    private ProjectApproachService projectApproachService;

    @Autowired
    private TimelineTemplateService timelineTemplateService;
    
    @Autowired
    private UserInformationService userInformationService;

    @Autowired
    private IncrementService incrementService;

    @Autowired
    private ProjectService projectService;

    private final static String milestoneFileName = "Projekteinrichtung";

    public List<Timeline> getTimelines() {
        List<Long> projectIds = userInformationService.getProjectIdList();

        return projectRepository.findAll()
                                 .stream()
                                 .map(p -> conversionService.convert(p, Timeline.class))
                                 .filter(Objects::nonNull)
                                 .filter(t -> projectIds.contains(t.getId()))
                                 .collect(Collectors.toList());
    }

    public List<Timeline> getActiveTimelines() {
        List<Long> projectIds = userInformationService.getProjectIdList();

        return projectRepository.findByArchived(false)
                                .stream()
                                .map(p -> conversionService.convert(p, Timeline.class))
                                .filter(Objects::nonNull)
                                .filter(t -> projectIds.contains(t.getId()))
                                .filter(t -> !t.getArchived())
                                .collect(Collectors.toList());
    }

    public List<Timeline> getArchivedTimelines() {
        List<Long> projectIds = userInformationService.getProjectIdList();

        return projectRepository.findByArchived(true)
                                 .stream()
                                 .map(p -> conversionService.convert(p, Timeline.class))
                                 .filter(Objects::nonNull)
                                 .filter(t -> projectIds.contains(t.getId()))
                                 .collect(Collectors.toList());
    }


    public ProjectEntity getProject(final Long timelineId) {
        return projectRepository.getById(timelineId);

    }

    public void moveTimelineByDays(final Long timelineId, final Long days) {

        ProjectEntity currentProject = getProject(timelineId);

        OffsetDateTime newTimelineStart = currentProject.getStartDate().plusDays(days);
        OffsetDateTime newTimelineEnd = currentProject.getEndDate().plusDays(days);

        currentProject.getRecurringEventTypes().forEach(t -> t.getRecurringEventPattern()
                                                              .setStartDate(newTimelineStart.toLocalDate()));

        projectService.updateRecurringEventsBasedOnStartDate(currentProject, newTimelineStart);
        currentProject.setStartDate(newTimelineStart);


        currentProject.getRecurringEventTypes().forEach(t -> t.getRecurringEventPattern()
                                                              .setEndDate(newTimelineEnd.toLocalDate()));
        projectService.updateRecurringEventsBasedOnEndDate(currentProject, newTimelineEnd);
        currentProject.setEndDate(newTimelineEnd);

        for (MilestoneTemplateEntity m : currentProject.getPlanTemplate().getMilestones()) {
            m.setDate(m.getDate().plusDays(days));
        }

        if (!currentProject.getIncrements().isEmpty()) {
            incrementService.updateDurationIncrements(timelineId);
        }
    }

    public void moveTimelineStartByDays(final Long timelineId, final Long days) {

        ProjectEntity currentProject = getProject(timelineId);

        OffsetDateTime timelineStart = currentProject.getStartDate();
        OffsetDateTime timelineEnd = currentProject.getEndDate();

        long oldHoursBetween = HOURS.between(timelineStart, timelineEnd);
        long newHoursBetween = oldHoursBetween - (days * 24);
        double factor = (double) newHoursBetween / oldHoursBetween;
        
        OffsetDateTime newTimelineStart = timelineStart.plusDays(days);
        currentProject.getRecurringEventTypes().forEach(t -> t.getRecurringEventPattern()
                                                              .setStartDate(newTimelineStart.toLocalDate()));
        projectService.updateRecurringEventsBasedOnStartDate(currentProject, newTimelineStart);
        currentProject.setStartDate(newTimelineStart);

        for (MilestoneTemplateEntity m : currentProject.getPlanTemplate().getMilestones()) {
            long oldMilestoneRelativePosition = HOURS.between(timelineStart, m.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            m.setDate(newTimelineStart.plusHours(newMilestoneRelativePosition));
        }

        if (!currentProject.getIncrements().isEmpty()) {
            incrementService.updateDurationIncrements(timelineId);
        }

    }

    public void moveTimelineEndByDays(final Long timelineId, final Long days) {

        ProjectEntity currentProject = getProject(timelineId);

        OffsetDateTime timelineStart = currentProject.getStartDate();
        OffsetDateTime timelineEnd = currentProject.getEndDate();

        long oldHoursBetween = HOURS.between(timelineStart, timelineEnd);
        long newHoursBetween = oldHoursBetween + (days * 24);
        double factor = (double) newHoursBetween / oldHoursBetween;
        
        OffsetDateTime newTimelineEnd = timelineEnd.plusDays(days);

        currentProject.getRecurringEventTypes().forEach(t -> t.getRecurringEventPattern()
                                                              .setEndDate(newTimelineEnd.toLocalDate()));
        projectService.updateRecurringEventsBasedOnEndDate(currentProject, newTimelineEnd);
        currentProject.setEndDate(newTimelineEnd);

        for (MilestoneTemplateEntity m : currentProject.getPlanTemplate().getMilestones()) {
            long oldMilestoneRelativePosition = HOURS.between(timelineStart, m.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            m.setDate(timelineStart.plusHours(newMilestoneRelativePosition));
        }

        if (!currentProject.getIncrements().isEmpty()) {
            incrementService.updateDurationIncrements(timelineId);
        }

    }

    public void moveMileStoneByDays(final Long timelineId, final Long days, final Long movedMilestoneId) {

        ProjectEntity currentProject = getProject(timelineId);
        PlanTemplateEntity planTemplateEntity = currentProject.getPlanTemplate();

        Optional<OffsetDateTime> oldFirstMilestoneOptionalDate = planTemplateEntity.getMilestones().stream()
        .map(MilestoneTemplateEntity::getDate).min(OffsetDateTime::compareTo);

        if (oldFirstMilestoneOptionalDate.isPresent()) {

            OffsetDateTime oldProjectStart = currentProject.getStartDate();

            for (MilestoneTemplateEntity m : planTemplateEntity.getMilestones()) {
                if (m.getId().equals(movedMilestoneId)) {
                    m.setDate(m.getDate().plusHours(days * 24));
                }
            }

            Optional<OffsetDateTime> newFirstMilestoneOptionalDate = planTemplateEntity.getMilestones().stream()
            .map(MilestoneTemplateEntity::getDate).min(OffsetDateTime::compareTo);

            if (newFirstMilestoneOptionalDate.isPresent()) {
                OffsetDateTime newFirstMilestoneDate = newFirstMilestoneOptionalDate.get();

                long hoursOffsetStart = HOURS.between(oldProjectStart, newFirstMilestoneDate);

                if (newFirstMilestoneDate.isBefore(oldProjectStart) || newFirstMilestoneDate.isEqual(oldProjectStart)) {
                    OffsetDateTime newProjectStart = oldProjectStart.plusHours(hoursOffsetStart - 24);

                    currentProject.getRecurringEventTypes()
                                  .forEach(t -> t.getRecurringEventPattern()
                                                 .setStartDate(newProjectStart.toLocalDate()));
                    projectService.updateRecurringEventsBasedOnStartDate(currentProject, newProjectStart);
                    currentProject.setStartDate(newProjectStart);

                }
                
            }

            Optional<OffsetDateTime> newLastMilestoneOptionalDate = planTemplateEntity.getMilestones().stream()
                .map(MilestoneTemplateEntity::getDate).max(OffsetDateTime::compareTo);

            if (newLastMilestoneOptionalDate.isPresent()) {
                OffsetDateTime newLastMilestoneDate = newLastMilestoneOptionalDate.get();

                OffsetDateTime oldProjectEnd = currentProject.getEndDate();

                long hoursOffsetEnd = HOURS.between(oldProjectEnd, newLastMilestoneDate);
                if (hoursOffsetEnd != 0) {

                    currentProject.getRecurringEventTypes()
                                  .forEach(t -> t.getRecurringEventPattern()
                                                 .setEndDate(newLastMilestoneDate.toLocalDate()));
                    projectService.updateRecurringEventsBasedOnEndDate(currentProject, newLastMilestoneDate);
                    currentProject.setEndDate(newLastMilestoneDate);
                }
            }
        }
        
    }

    public File getCalendarFileForTimeline(final Long timelineId) throws IOException {
        ProjectEntity currentProject = getProject(timelineId);

        IcsCalendar icsCalendar = new IcsCalendar();
        TimeZone timezone = icsCalendar.createTimezoneEurope();

        final ProjectApproachEntity projectApproach = currentProject.getProjectApproach();

        String projectEventTitle = "Projektstart" + " - " + projectApproach.getName();
        icsCalendar.addEvent(timezone, currentProject.getStartDate().toLocalDate(), projectEventTitle, "Test Comment");

        List<Milestone> milestones = milestoneService.getMilestonesForTimeline(timelineId);
        for (Milestone milestone : milestones) {
            LocalDate eventDate = milestone.getDate();
            String eventTitle = milestone.getName() + " - " + projectApproach.getName();
            String eventComment = "Test Comment";

            icsCalendar.addEvent(timezone, eventDate, eventTitle, eventComment);
        }

        return icsCalendar.getCalendarFile("Meilensteine");
    }

    public void updateTimeline(final Timeline timeline) {

        ProjectEntity project = getProject(timeline.getId());
        if (timeline.getProjectType() != null) {
            project.setProjectType(timeline.getProjectType().toString());
            projectRepository.save(project);
        }

        if (timeline.getStart() != project.getStartDate().toLocalDate()) {
            long daysBetween = DAYS.between(project.getStartDate().toLocalDate(), timeline.getStart());
            moveTimelineStartByDays(timeline.getId(), daysBetween);
        }

        if (timeline.getEnd() != project.getEndDate().toLocalDate()) {
            long daysBetween = DAYS.between(project.getEndDate().toLocalDate(), timeline.getEnd());
            moveTimelineEndByDays(timeline.getId(), daysBetween);
        }
   
        if (!timeline.getProjectApproachId().equals(project.getProjectApproach().getId())) {
            
            project.setProjectApproach(projectApproachService.getProjectApproachFromRepo(timeline.getProjectApproachId()));

            PlanTemplateEntity planTemplate = projectApproachService.getDefaultPlanTemplateEntityFromRepo(timeline.getProjectApproachId()); 
            List<MilestoneTemplateEntity> repoMilestones = new ArrayList<>(planTemplate.getMilestones());

            PlanTemplateEntity projectPlanTemplate = project.getPlanTemplate();

            projectPlanTemplate.getMilestones()
                               .forEach(m -> milestoneTemplateRepository.delete(m));

            List<MilestoneTemplateEntity> newMilestones = new ArrayList<>();

            for (MilestoneTemplateEntity milestone: repoMilestones) {
                MilestoneTemplateEntity newMilestone = new MilestoneTemplateEntity(milestone);
                
                newMilestone.setPlanTemplate(projectPlanTemplate);
    
                newMilestones.add(newMilestone);
            }
            
            newMilestones = timelineTemplateService.updateMilestonesTimelineTemplate(timeline.getId(), newMilestones, planTemplate);

            milestoneTemplateRepository.saveAll(newMilestones);
            project.getIncrements()
                .forEach(i -> incrementRepository.delete(i));
                
            project.setIncrements(null);
            projectRepository.save(project);

            userInformationService.updateNewProjectRolesForTemplate(project);

        }


    }

    public List<DownloadFile> getFilesForMilestone(final Long timelineId, final Long milestoneId) {

        List<Long> downloadFileIds = getDownloadFileIds(timelineId, milestoneId);

        return fileRepository.findAll()
                .stream()
                .filter(file -> downloadFileIds.contains(file.getId()))
                .map(p -> conversionService.convert(p, DownloadFile.class))
                .collect(Collectors.toList());
    }

    private List<Long> getDownloadFileIds(final Long timelineId, final Long milestoneId) {

        ProjectEntity currentProject = getProject(timelineId);
        final ProjectApproachEntity projectApproach = currentProject.getProjectApproach();

        Optional<MilestoneTemplateEntity> firstMilestone = currentProject.getPlanTemplate()
                                                                         .getMilestones()
                                                                         .stream()
                                                                         .filter(m -> m.getName().equals(milestoneFileName))
                                                                         .findFirst();

        if (firstMilestone.isEmpty() || !milestoneId.equals(firstMilestone.get().getId()) || projectApproach == null ||
                !projectApproach.getOperationType().getId().equals(2L)) {
            return Collections.emptyList();
        }

        List<Long> downloadFileIds = new ArrayList<>();

        if (ProjectTypeEnum.fromValue(currentProject.getProjectType()) == ProjectTypeEnum.AN_PROJEKT) {
            if (projectApproach.isIterative()) {
                downloadFileIds.add(3L);
            } else {
                downloadFileIds.add(1L);
            }
        } else if (ProjectTypeEnum.fromValue(currentProject.getProjectType()) == ProjectTypeEnum.INTERNES_PROJEKT) {
            if (projectApproach.isIterative()) {
                downloadFileIds.add(4L);
            } else {
                downloadFileIds.add(2L);
            }
        }

        List<Long> vmxtProjectFiles = Arrays.asList(5L, 6L, 7L);
        downloadFileIds.addAll(vmxtProjectFiles);

        return downloadFileIds;
    }

}
