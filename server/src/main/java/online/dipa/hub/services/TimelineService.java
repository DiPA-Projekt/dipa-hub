package online.dipa.hub.services;

import net.fortuna.ical4j.model.TimeZone;
import online.dipa.hub.IcsCalendar;
import online.dipa.hub.api.model.*;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.repositories.*;
import online.dipa.hub.session.model.SessionTimeline;
import online.dipa.hub.session.state.SessionTimelineState;
import online.dipa.hub.UserAdministration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

import static java.time.temporal.ChronoUnit.DAYS;
import static java.time.temporal.ChronoUnit.HOURS;

import static online.dipa.hub.api.model.Timeline.ProjectTypeEnum;

@Service
@Transactional
public class TimelineService {

    @Autowired
    private SessionTimelineState sessionTimelineState;

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ProjectRepository projectRespository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private IncrementService incrementService;

    @Autowired
    private MilestoneService milestoneService;

    @Autowired
    private ProjectApproachService projectApproachService;

    @Autowired
    private UserAdministration userAdministration;


    protected static final long FIRST_MASTER_MILESTONE_ID = 21;

    public List<Timeline> getTimelines() {
        initializeTimelines();

        List<String> userGroups = userAdministration.getGroups();
        return sessionTimelineState.getSessionTimelines().values().stream().map(SessionTimeline::getTimeline)
                                   .filter(t -> userGroups.contains(String.valueOf(t.getId()))).collect(Collectors.toList());
    }

    public Timeline getTimeline(final Long timelineId) {
        initializeTimelines();

        return sessionTimelineState.getSessionTimelines().values().stream().map(SessionTimeline::getTimeline)
                .filter(t -> t.getId().equals(timelineId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Timeline with id: %1$s not found.", timelineId)));
    }

    private void initializeTimelines() {
        Map<Long, SessionTimeline> listTimelines = new HashMap<>();

        projectRespository.findAll().stream().map(p -> conversionService.convert(p, Timeline.class))
                .forEach(t -> {
                    SessionTimeline sessionTimeline = sessionTimelineState.findTimelineState(t.getId());

                    if (sessionTimeline.getTimeline() == null) {
                        sessionTimeline.setTimeline(t);
                    }
                    listTimelines.put(t.getId(), sessionTimeline);
                });

        sessionTimelineState.setSessionTimelines(listTimelines);
    }

    ProjectApproachEntity findProjectApproach(Long projectApproachId) {
        return projectRespository.findAll().stream()
        .filter(p -> p.getProjectApproach().getId().equals(projectApproachId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Project approach with id: %1$s not found.", projectApproachId))).getProjectApproach();
    }

    public void moveTimelineByDays(final Long timelineId, final Long days) {

        SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);

        milestoneService.updateTempMilestones(timelineId);

        LocalDate newTimelineStart = sessionTimeline.getTimeline().getStart().plusDays(days);
        LocalDate newTimelineEnd = sessionTimeline.getTimeline().getEnd().plusDays(days);

        sessionTimeline.getTimeline().setStart(newTimelineStart);
        sessionTimeline.getTimeline().setEnd(newTimelineEnd);

        for (Milestone m : sessionTimeline.getMilestones()) {
            m.setDate(m.getDate().plusDays(days));
        }

        for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
            temp.setDate(temp.getDate().plusDays(days));
        }

        incrementService.updateIncrements(timelineId);

    }

    public void moveTimelineStartByDays(final Long timelineId, final Long days) {

        SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);

        milestoneService.updateTempMilestones(timelineId);

        OffsetDateTime timelineStart = 
        OffsetDateTime.of(sessionTimeline.getTimeline().getStart(), LocalTime.NOON, ZoneOffset.UTC);
        // sessionTimeline.getTimeline().getStart();
        OffsetDateTime timelineEnd = 
        OffsetDateTime.of(sessionTimeline.getTimeline().getEnd(), LocalTime.NOON, ZoneOffset.UTC);
        // sessionTimeline.getTimeline().getEnd();

        long oldDaysBetween = HOURS.between(timelineStart, timelineEnd);
        long newDaysBetween = oldDaysBetween - (days * 24);
        double factor = (double) newDaysBetween / oldDaysBetween;

        OffsetDateTime newTimelineStart = timelineStart.plusDays(days);
        sessionTimeline.getTimeline().setStart(newTimelineStart.toLocalDate());

        for (Milestone m : sessionTimeline.getMilestones()) {
            long oldMilestoneRelativePosition = HOURS.between(timelineStart, m.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            m.setDate(newTimelineStart.plusHours(newMilestoneRelativePosition));

            // m.setDate(newTimelineStart.plusDays(newMilestoneRelativePosition));

        }

        for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
            long oldMilestoneRelativePosition = HOURS.between(timelineStart, temp.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            temp.setDate(newTimelineStart.plusHours(newMilestoneRelativePosition));

            // temp.setDate(newTimelineStart.plusDays(newMilestoneRelativePosition));

        }

        incrementService.updateIncrements(timelineId);

    }

    public void moveTimelineEndByDays(final Long timelineId, final Long days) {

        SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);

        milestoneService.updateTempMilestones(timelineId);

        // LocalDate timelineStart = sessionTimeline.getTimeline().getStart();
        
        OffsetDateTime timelineStart = 
        OffsetDateTime.of(sessionTimeline.getTimeline().getStart(), LocalTime.NOON, ZoneOffset.UTC);

        // LocalDate timelineEnd = sessionTimeline.getTimeline().getEnd();
        OffsetDateTime timelineEnd = 
        OffsetDateTime.of(sessionTimeline.getTimeline().getEnd(), LocalTime.NOON, ZoneOffset.UTC);

        // long oldDaysBetween = DAYS.between(timelineStart, timelineEnd);
        // long newDaysBetween = oldDaysBetween + days;
        // double factor = (double) newDaysBetween / oldDaysBetween;

        long oldDaysBetween = HOURS.between(timelineStart, timelineEnd);
        long newDaysBetween = oldDaysBetween + (days * 24);
        double factor = (double) newDaysBetween / oldDaysBetween;

        // LocalDate newTimelineEnd = timelineEnd.plusDays(days);
        // sessionTimeline.getTimeline().setEnd(newTimelineEnd);

        OffsetDateTime newTimelineEnd = timelineEnd.plusDays(days);
        sessionTimeline.getTimeline().setEnd(newTimelineEnd.toLocalDate());
        
        // OffsetDateTime timelineStart = 
        // OffsetDateTime.of(sessionTimeline.getTimeline().getStart(), LocalTime.NOON, ZoneOffset.UTC);
        // // sessionTimeline.getTimeline().getStart();
        // OffsetDateTime timelineEnd = 
        // OffsetDateTime.of(sessionTimeline.getTimeline().getEnd(), LocalTime.NOON, ZoneOffset.UTC);
        // // sessionTimeline.getTimeline().getEnd();

        // long oldDaysBetween = HOURS.between(timelineStart, timelineEnd);
        // long newDaysBetween = oldDaysBetween - (days * 24);
        // double factor = (double) newDaysBetween / oldDaysBetween;

        // OffsetDateTime newTimelineEnd = timelineEnd.plusDays(days);
        // sessionTimeline.getTimeline().setEnd(newTimelineEnd.toLocalDate());


        for (Milestone m : sessionTimeline.getMilestones()) {
            long oldMilestoneRelativePosition = HOURS.between(timelineStart, m.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            // m.setDate(OffsetDateTime.of(timelineStart.plusDays(newMilestoneRelativePosition), LocalTime.NOON, ZoneOffset.UTC));
            // m.setDate(timelineStart.plusDays(newMilestoneRelativePosition));
            m.setDate(timelineStart.plusHours(newMilestoneRelativePosition));
            System.out.println(m.getDate());

        }

        for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
            long oldMilestoneRelativePosition = HOURS.between(timelineStart, temp.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            // temp.setDate(OffsetDateTime.of(timelineStart.plusDays(newMilestoneRelativePosition), LocalTime.NOON, ZoneOffset.UTC));
            temp.setDate(timelineStart.plusHours(newMilestoneRelativePosition));

            // temp.setDate(timelineStart.plusDays(newMilestoneRelativePosition));
        }

        incrementService.updateIncrements(timelineId);

    }

    public void moveMileStoneByDays(final Long timelineId, final Long days, final Long movedMilestoneId) {
        SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);

        Optional<OffsetDateTime> oldFirstMilestoneOptionalDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
                .min(OffsetDateTime::compareTo);
        if (oldFirstMilestoneOptionalDate.isPresent()) {

            LocalDate oldProjectStart = sessionTimeline.getTimeline().getStart();

            for (Milestone m : sessionTimeline.getMilestones()) {
                if (m.getId().equals(movedMilestoneId)) {
                    m.setDate(m.getDate().plusDays(days));
                }
            }

            Optional<OffsetDateTime> newFirstMilestoneOptionalDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
                    .min(OffsetDateTime::compareTo);
            if (newFirstMilestoneOptionalDate.isPresent()) {
                LocalDate newFirstMilestoneDate = newFirstMilestoneOptionalDate.get().toLocalDate();

                long daysOffsetStart = Duration.between(oldProjectStart.atStartOfDay(), newFirstMilestoneDate.atStartOfDay())
                        .toDays();

                if (newFirstMilestoneDate.isBefore(oldProjectStart) || newFirstMilestoneDate.isEqual(oldProjectStart)) {
                    LocalDate newProjectStart = oldProjectStart.plusDays(daysOffsetStart - 1);

                    sessionTimeline.getTimeline().setStart(newProjectStart);
                }
                
            }

            Optional<OffsetDateTime> newLastMilestoneOptionalDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
                    .max(OffsetDateTime::compareTo);

            if (newLastMilestoneOptionalDate.isPresent()) {
                LocalDate newLastMilestoneDate = newLastMilestoneOptionalDate.get().toLocalDate();

                LocalDate oldProjectEnd = sessionTimeline.getTimeline().getEnd();

                long daysOffsetEnd = Duration.between(oldProjectEnd.atStartOfDay(), newLastMilestoneDate.atStartOfDay())
                        .toDays();
                LocalDate newProjectEnd = sessionTimeline.getTimeline().getEnd().plusDays(daysOffsetEnd);

                sessionTimeline.getTimeline().setEnd(newProjectEnd);
            }
        }
    }

    public File getCalendarFileForTimeline(final Long timelineId) throws IOException {
        SessionTimeline sessionTimeline = sessionTimelineState.findTimelineState(timelineId);

        IcsCalendar icsCalendar = new IcsCalendar();
        TimeZone timezone = icsCalendar.createTimezoneEurope();

        final ProjectApproachEntity projectApproach = findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());

        if (projectApproach != null) {

            String projectEventTitle = "Projektstart" + " - " + projectApproach.getName();
            icsCalendar.addEvent(timezone, sessionTimeline.getTimeline().getStart(), projectEventTitle, "Test Comment");

            List<Milestone> milestones = milestoneService.getMilestonesForTimeline(timelineId);
            for (Milestone milestone : milestones) {
                LocalDate eventDate = milestone.getDate().toLocalDate();
                String eventTitle = milestone.getName() + " - " + projectApproach.getName();
                String eventComment = "Test Comment";

                icsCalendar.addEvent(timezone, eventDate, eventTitle, eventComment);
            }
        }

        return icsCalendar.getCalendarFile("Meilensteine");
    }

    public void updateTimeline(final Timeline timeline) {

        SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timeline.getId());

        projectRespository.findAll().stream()
            .filter(t -> t.getId().equals(timeline.getId())).findFirst()
            .ifPresent(projectEntity -> {

                projectEntity.setProjectApproach(projectApproachService.getProjectApproachFromRepo(timeline.getProjectApproachId()));
                projectRespository.save(projectEntity);

            });

        sessionTimeline.getTimeline().setProjectType(timeline.getProjectType());
        sessionTimeline.getTimeline().setOperationTypeId(timeline.getOperationTypeId());
        sessionTimeline.getTimeline().setProjectApproachId(timeline.getProjectApproachId());

        sessionTimeline.setMilestones(null);
        sessionTimeline.setIncrements(null);
        sessionTimeline.setTempIncrementMilestones(null);

        sessionTimelineState.getSessionTimelineTemplates().remove(timeline.getId());

        milestoneService.initializeMilestones(timeline.getId());
        milestoneService.updateMilestonesAndIncrement(timeline);
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

        final SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);
        final ProjectApproachEntity projectApproach = findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());

        if (milestoneId != FIRST_MASTER_MILESTONE_ID || projectApproach == null) {
            return Collections.emptyList();
        }

        List<Long> downloadFileIds = new ArrayList<>();

        if (sessionTimeline.getTimeline().getProjectType() == ProjectTypeEnum.AN_PROJEKT) {
            if (projectApproach.isIterative()) {
                downloadFileIds.add(3L);
            } else {
                downloadFileIds.add(1L);
            }
        } else if (sessionTimeline.getTimeline().getProjectType() == ProjectTypeEnum.INTERNES_PROJEKT) {
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

    void getValuesFromHashMap(HashMap<Increment, List<Milestone>> hashMap, List<Milestone> list) {

        for (List<Milestone> value : hashMap.values()) {
            list.addAll(value);
        }
    }


    boolean filterOperationType(PlanTemplateEntity template, final Long operationTypeId) {
        Optional<OperationType> operationType = template.getOperationTypes().stream()
            .map(p -> conversionService.convert(p, OperationType.class))
            .filter(o -> o.getId().equals(operationTypeId)).findFirst();

        return operationType.isPresent();

    }

    boolean filterProjectApproach(PlanTemplateEntity template, final Long projectApproachId) {
        Optional<ProjectApproach> projectApproach = template.getProjectApproaches().stream()
            .map(p -> conversionService.convert(p, ProjectApproach.class))
            .filter(o -> o.getId().equals(projectApproachId)).findFirst();

        return projectApproach.isPresent();

    }

}
