package online.dipa.hub.services;

import net.fortuna.ical4j.model.TimeZone;
import online.dipa.hub.IcsCalendar;
import online.dipa.hub.TimelineState;
import online.dipa.hub.api.model.Increment;
import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.ProjectApproach;
import online.dipa.hub.api.model.OperationType;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;

import online.dipa.hub.persistence.repositories.PlanTemplateRepository;
import online.dipa.hub.persistence.repositories.ProjectApproachRepository;
import online.dipa.hub.persistence.repositories.ProjectRepository;
import online.dipa.hub.persistence.repositories.OperationTypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.SessionScope;


import javax.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.util.*;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
@SessionScope
@Transactional
public class TimelineService {

    private Map<Long, TimelineState> sessionTimelines;

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ProjectRepository projectRespository;

    @Autowired
    private ProjectApproachRepository projectApproachRepository;

    @Autowired
    private OperationTypeRepository operationTypeRepository;

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    public List<Timeline> getTimelines() {
        initializeTimelines();

        return this.sessionTimelines.values().stream().map(TimelineState::getTimeline).collect(Collectors.toList());
    }

    public Timeline getTimeline(final Long timelineId) {
        initializeTimelines();

        return this.sessionTimelines.values().stream().map(TimelineState::getTimeline)
                .filter(t -> t.getId().equals(timelineId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Timeline with id: %1$s not found.", timelineId)));
    }

    private void initializeTimelines() {

        projectRespository.findAll().stream().map(p -> conversionService.convert(p, Timeline.class))
                .forEach(t -> {
                    TimelineState sessionTimeline = findTimelineState(t.getId());
                    if (sessionTimeline.getTimeline() == null) {
                        sessionTimeline.setTimeline(t);
                    }
                });
    }

    public List<OperationType> getOperationTypes() {

        return operationTypeRepository.findAll().stream().map(p -> conversionService.convert(p, OperationType.class))
                .collect(Collectors.toList());
    }

    public List<ProjectApproach> getProjectApproaches() {

        return projectApproachRepository.findAll().stream()
                .map(p -> conversionService.convert(p, ProjectApproach.class)).collect(Collectors.toList());
    }

    public List<Milestone> getMilestonesForTimeline(final Long timelineId) {
        initializeMilestones(timelineId);

        return this.sessionTimelines.get(timelineId).getMilestones();
    }

    private void initializeMilestones(final Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        final ProjectApproachEntity projectApproach = findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());

        if (projectApproach != null && sessionTimeline.getMilestones() == null) {
            if (projectApproach.isIterative()) {
                initializeIncrements(timelineId);
                sessionTimeline.setMilestones(this.loadMilestones(timelineId, 1));
            } else {
                sessionTimeline.setMilestones(this.loadMilestones(timelineId, 0));
            }
        }
    
    }

    private List<Milestone> loadMilestones(final Long timelineId, final int incrementCount) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        List<Milestone> milestones = new ArrayList<>();

        // get template Milestones
        if (sessionTimeline.getTempIncrementMilestones() == null) {
            milestones = getMilestonesFromRespository(timelineId);
        } else {
            milestones = new ArrayList<>(sessionTimeline.getTempIncrementMilestones());
        }

        // get initial milestones
        if (incrementCount == 0) {

            return milestones;
        } else {

            List<Milestone> incrementMilestones = new ArrayList<Milestone>();

            // add master plan into milestones list
            if (sessionTimeline.getMilestones() == null) {

                incrementMilestones.add(milestones.get(0));
                incrementMilestones.add(milestones.get(milestones.size() - 1));
            } else {

                List<Milestone> currentMilestones = sessionTimeline.getMilestones();

                incrementMilestones.add(currentMilestones.get(0));
                incrementMilestones.add(currentMilestones.get(currentMilestones.size() - 1));
            }

            for (Entry<Increment, List<Milestone>> entry : getIncrementMilestones(milestones, timelineId,
                    incrementCount).entrySet()) {
                List<Milestone> milestonesList = entry.getValue();
                incrementMilestones.addAll(milestonesList);
            }

            return incrementMilestones.stream().map(m -> conversionService.convert(m, Milestone.class))
                    .sorted(Comparator.comparing(Milestone::getDate)).collect(Collectors.toList());
        }
    }

    private HashMap<Increment, List<Milestone>> getIncrementMilestones(List<Milestone> tempMilestones,
            final Long timelineId, final int incrementCount) {

        TimelineState sessionTimeline = findTimelineState(timelineId);

        List<Increment> incrementsList = loadIncrements(timelineId, incrementCount);

        tempMilestones.remove(tempMilestones.size() - 1);
        tempMilestones.remove(0);

        LocalDate firstDatePeriod = tempMilestones.stream().map(Milestone::getDate).min(LocalDate::compareTo).get();
        LocalDate lastDatePeriod = tempMilestones.stream().map(Milestone::getDate).max(LocalDate::compareTo).get();

        long id = tempMilestones.stream().map(Milestone::getId).min(Long::compareTo).get();
        long count = 0;

        HashMap<Increment, List<Milestone>> hashmapIncrementMilestones = new HashMap<>();
        long oldDaysBetween = DAYS.between(firstDatePeriod, lastDatePeriod);

        for (Increment increment : incrementsList) {
            List<Milestone> incrementMilestones = new ArrayList<Milestone>();

            long newDaysBetween = DAYS.between(increment.getStart().plusDays(14), increment.getEnd());
            LocalDate newStartDateIncrement = increment.getStart().plusDays(14);

            double factor = (double) newDaysBetween / oldDaysBetween;

            for (Milestone m : tempMilestones) {

                long daysFromFirstDate = DAYS.between(firstDatePeriod, newStartDateIncrement);
                LocalDate newDateBeforeScale = m.getDate().plusDays(daysFromFirstDate);

                long relativePositionBeforeScale = DAYS.between(newStartDateIncrement, newDateBeforeScale);
                long newDateAfterScale = (long)(relativePositionBeforeScale * factor);
                long milestoneId = id + count;

                Milestone newMilestone = new Milestone();
                newMilestone.setId(milestoneId);
                newMilestone.setName(m.getName());
                newMilestone.setDate(increment.getStart().plusDays(newDateAfterScale).plusDays(14));

                if (sessionTimeline.getMilestones() != null) {
                    Milestone oldMilestone =  sessionTimeline.getMilestones().stream().filter(milestone -> milestone.getId().equals(milestoneId)).findFirst().orElse(null);

                    if (oldMilestone != null) {
                        newMilestone.setStatus(oldMilestone.getStatus());
                    }
                    else {
                        newMilestone.setStatus(Milestone.StatusEnum.OFFEN);
                    }
                }
                else {
                    newMilestone.setStatus(Milestone.StatusEnum.OFFEN);
                }

                incrementMilestones.add(newMilestone);

                count++;
            }
            hashmapIncrementMilestones.put(increment, incrementMilestones);

        }

        return hashmapIncrementMilestones;
    }

    private List<Milestone> getMilestonesFromRespository(final Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        final ProjectApproachEntity projectApproach = findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());

        List<Milestone> milestones = new ArrayList<Milestone>();

        if (projectApproach != null) {

            Long operationTypeId = projectApproach.getOperationType().getId();

            final List<PlanTemplateEntity> planTemplateList = planTemplateRepository.findAll().stream()
                    .filter(template -> template.getOperationTypeEntity().getId().equals(operationTypeId))
                    .collect(Collectors.toList());

            if (planTemplateList.size() == 1) {
                milestones = convertMilestones(planTemplateList.get(0));
            } 
            else {

                long masterPlanId = 2;
                PlanTemplateEntity masterPlanTemplate = planTemplateList.stream()
                        .filter(template -> template.getId().equals(masterPlanId)).findFirst().orElse(null);
        
                if (masterPlanTemplate != null) {
                    milestones.addAll(convertMilestones(masterPlanTemplate));
                }

                PlanTemplateEntity planTemplate = planTemplateList.stream()
                        .filter(template -> template.getProjectApproach() != null)
                        .filter(template -> template.getProjectApproach().getId().equals(projectApproach.getId()))
                        .findFirst().orElse(null);
                
                if (planTemplate != null) {
                    milestones.addAll(convertMilestones(planTemplate));
                }
                
            }

            return milestones.stream().map(m -> conversionService.convert(m, Milestone.class))
                .sorted(Comparator.comparing(Milestone::getDate)).collect(Collectors.toList());
        }
        return milestones;

    }

    private List<Milestone> convertMilestones(PlanTemplateEntity planTemplate) {
        return planTemplate.getMilestones().stream().map(m -> conversionService.convert(m, Milestone.class))
                .sorted(Comparator.comparing(Milestone::getDate)).collect(Collectors.toList());
    }

    public List<Increment> getIncrementsForTimeline(final Long timelineId) {

        // initializeMilestones(timelineId);
        initializeIncrements(timelineId);

        List<Increment> result = this.sessionTimelines.get(timelineId).getIncrements();

        return Objects.requireNonNullElse(result, Collections.emptyList());
    }

    private void initializeIncrements(final Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        if (sessionTimeline.getIncrements() == null) {
            final ProjectApproachEntity projectApproach = this.findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());

            if (projectApproach != null && projectApproach.isIterative()) {
                sessionTimeline.setIncrements(this.loadIncrements(timelineId, 1));
            }
        }
    }

    private List<Increment> loadIncrements(final Long timelineId, final int incrementCount) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        List<Milestone> milestones = getMilestonesFromRespository(timelineId);

        // delete masterplan from milestones list
        milestones.remove(milestones.size() - 1);
        milestones.remove(0);

        LocalDate firstMilestoneDate;
        LocalDate lastMilestoneDate;
        long daysBetween;
        List<Increment> incrementsList = new ArrayList<Increment>();

        if (sessionTimeline.getMilestones() == null) {

            //minus 14 days for "Inkrement geplant"
            firstMilestoneDate = milestones.stream().map(Milestone::getDate).min(LocalDate::compareTo).get().minusDays(14);
            lastMilestoneDate = milestones.stream().map(Milestone::getDate).max(LocalDate::compareTo).get();

            daysBetween = DAYS.between(firstMilestoneDate, lastMilestoneDate);

        }
        else {

            List<Milestone> currentMilestones = sessionTimeline.getMilestones();

            firstMilestoneDate = currentMilestones.get(1).getDate().minusDays(14);
            lastMilestoneDate = currentMilestones.get(currentMilestones.size()-2).getDate();

            daysBetween = DAYS.between(firstMilestoneDate, lastMilestoneDate);

        }

        long durationIncrement = daysBetween / incrementCount;

        long id = 1;

        LocalDate startDateIncrement = firstMilestoneDate;
        LocalDate endDateIncrement = startDateIncrement.plusDays(durationIncrement);

        for (int i = 0; i < incrementCount; i++) {

            Increment increment = new Increment();
            increment.setId(id);
            increment.setName("Inkrement " + id);
            increment.setStart(startDateIncrement);
            increment.setEnd(endDateIncrement);

            incrementsList.add(increment);

            id++;
            startDateIncrement = endDateIncrement.plusDays(1);

            if (i == (incrementCount - 2)) {
                endDateIncrement = lastMilestoneDate;
            } else {
                endDateIncrement = endDateIncrement.plusDays(durationIncrement);
            }

        }

        return incrementsList;
    }

    public void addIncrement(Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        int incrementCount = sessionTimeline.getIncrements().size();

        sessionTimeline.setIncrements(this.loadIncrements(timelineId, incrementCount + 1));
        sessionTimeline.setMilestones(this.loadMilestones(timelineId, incrementCount + 1));
    }

    public void deleteIncrement(Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        int incrementCount = sessionTimeline.getIncrements().size();

        if (incrementCount != 1) {
            sessionTimeline.setIncrements(this.loadIncrements(timelineId, incrementCount - 1));
            sessionTimeline.setMilestones(this.loadMilestones(timelineId, incrementCount - 1));
        }
    }

    private ProjectApproachEntity findProjectApproach(Long projectApproachId) {
        return projectApproachRepository.findAll().stream()
        .filter(p -> p.getId().equals(projectApproachId)).findFirst().orElse(null);
    }

    private TimelineState findTimelineState(Long timelineId) {
        return getSessionTimelines().computeIfAbsent(timelineId, t -> new TimelineState());
    }

    private Map<Long, TimelineState> getSessionTimelines() {
        if (this.sessionTimelines == null) {
            this.sessionTimelines = new HashMap<>();
        }
        return this.sessionTimelines;
    }

    public void moveTimelineByDays(final Long timelineId, final Long days) {

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

        updateTempMilestones(timelineId);

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

        updateIncrements(timelineId);

    }

    public void moveTimelineStartByDays(final Long timelineId, final Long days) {

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

        updateTempMilestones(timelineId);

        LocalDate timelineStart = sessionTimeline.getTimeline().getStart();
        LocalDate timelineEnd = sessionTimeline.getTimeline().getEnd();

        long oldDaysBetween = DAYS.between(timelineStart, timelineEnd);
        long newDaysBetween = oldDaysBetween - days;
        double factor = (double) newDaysBetween / oldDaysBetween;

        LocalDate newTimelineStart = timelineStart.plusDays(days);
        sessionTimeline.getTimeline().setStart(newTimelineStart);

        for (Milestone m : sessionTimeline.getMilestones()) {
            long oldMilestoneRelativePosition = DAYS.between(timelineStart, m.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            m.setDate(newTimelineStart.plusDays(newMilestoneRelativePosition));
        }

        for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
            long oldMilestoneRelativePosition = DAYS.between(timelineStart, temp.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            temp.setDate(newTimelineStart.plusDays(newMilestoneRelativePosition));
        }

        updateIncrements(timelineId);

    }

    public void moveTimelineEndByDays(final Long timelineId, final Long days) {

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

        updateTempMilestones(timelineId);

        LocalDate timelineStart = sessionTimeline.getTimeline().getStart();
        LocalDate timelineEnd = sessionTimeline.getTimeline().getEnd();

        long oldDaysBetween = DAYS.between(timelineStart, timelineEnd);
        long newDaysBetween = oldDaysBetween + days;
        double factor = (double) newDaysBetween / oldDaysBetween;

        LocalDate newTimelineEnd = timelineEnd.plusDays(days);
        sessionTimeline.getTimeline().setEnd(newTimelineEnd);

        for (Milestone m : sessionTimeline.getMilestones()) {
            long oldMilestoneRelativePosition = DAYS.between(timelineStart, m.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            m.setDate(timelineStart.plusDays(newMilestoneRelativePosition));
        }

        for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
            long oldMilestoneRelativePosition = DAYS.between(timelineStart, temp.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            temp.setDate(timelineStart.plusDays(newMilestoneRelativePosition));
        }

        updateIncrements(timelineId);

    }

    public void moveMileStoneByDays(final Long timelineId, final Long days, final Long movedMilestoneId) {
        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

        LocalDate oldFirstMilestoneDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
                .min(LocalDate::compareTo).get();
        LocalDate oldProjectStart = sessionTimeline.getTimeline().getStart();
        long diffProjectStartMilestone = Duration
                .between(oldFirstMilestoneDate.atStartOfDay(), oldProjectStart.atStartOfDay()).toDays();

        for (Milestone m : sessionTimeline.getMilestones()) {
            if (m.getId().equals(movedMilestoneId)) {
                m.setDate(m.getDate().plusDays(days));
            }
        }

        LocalDate newFirstMilestoneDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
                .min(LocalDate::compareTo).get();
        long daysOffsetStart = Duration.between(oldProjectStart.atStartOfDay(), newFirstMilestoneDate.atStartOfDay())
                .toDays();
        LocalDate newProjectStart = sessionTimeline.getTimeline().getStart()
                .plusDays(daysOffsetStart + diffProjectStartMilestone);

        LocalDate newLastMilestoneDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
                .max(LocalDate::compareTo).get();
        LocalDate oldProjectEnd = sessionTimeline.getTimeline().getEnd();

        long daysOffsetEnd = Duration.between(oldProjectEnd.atStartOfDay(), newLastMilestoneDate.atStartOfDay())
                .toDays();
        LocalDate newProjectEnd = sessionTimeline.getTimeline().getEnd().plusDays(daysOffsetEnd);

        sessionTimeline.getTimeline().setStart(newProjectStart);
        sessionTimeline.getTimeline().setEnd(newProjectEnd);
    }

    public File getCalendarFileForTimeline(final Long timelineId) throws IOException {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        IcsCalendar icsCalendar = new IcsCalendar();
        TimeZone timezone = icsCalendar.createTimezoneEurope();

        final ProjectApproachEntity projectApproach = findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());

        if (projectApproach != null) {
            String projectEventTitle = "Projektstart" + " - " + projectApproach.getName();
            icsCalendar.addEvent(timezone, sessionTimeline.getTimeline().getStart(), projectEventTitle, "Test Comment");
    
            List<Milestone> milestones = getMilestonesForTimeline(timelineId);
            for (Milestone milestone : milestones) {
                LocalDate eventDate = milestone.getDate();
                String eventTitle = milestone.getName() + " - " + projectApproach.getName();
                String eventComment = "Test Comment";
    
                icsCalendar.addEvent(timezone, eventDate, eventTitle, eventComment);
            }
        }

        return icsCalendar.getCalendarFile("Meilensteine");
    }

    private void updateIncrements(final Long timelineId) {

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

        List<Increment> increments = sessionTimeline.getIncrements();

        if (increments != null) {
            int incrementCount = increments.size();
            sessionTimeline.setIncrements(this.loadIncrements(timelineId, incrementCount));
            sessionTimeline.setMilestones(this.loadMilestones(timelineId, incrementCount));

        }
    }

    private void updateTempMilestones(final Long timelineId) {

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

        if (sessionTimeline.getTempIncrementMilestones() == null) {

            List<Milestone> tempMilestonesList = new ArrayList<Milestone>(getMilestonesFromRespository(timelineId));
            sessionTimeline.setTempIncrementMilestones(tempMilestonesList);
        }
    }

    public void updateProject(final Timeline timeline) {

        TimelineState sessionTimeline = getSessionTimelines().get(timeline.getId());
        sessionTimeline.getTimeline().setOperationTypeId(timeline.getOperationTypeId());
        sessionTimeline.getTimeline().setProjectApproachId(timeline.getProjectApproachId());

        sessionTimeline.setMilestones(null);
        sessionTimeline.setIncrements(null);
        sessionTimeline.setTempIncrementMilestones(null);

        this.initializeMilestones(timeline.getId());
        this.updateMilestonesAndIncrement(timeline);
    }

    public void updateMilestonesAndIncrement(final Timeline timeline) {

        TimelineState sessionTimeline = getSessionTimelines().get(timeline.getId());

        updateTempMilestones(timeline.getId());

        LocalDate initTimelineStart = LocalDate.now();
        LocalDate initTimelineEnd = sessionTimeline.getMilestones().stream().map(Milestone::getDate).max(LocalDate::compareTo).get();

        LocalDate currentTimelineStart = sessionTimeline.getTimeline().getStart();
        LocalDate currentTimelineEnd = sessionTimeline.getTimeline().getEnd();

        long oldDaysBetween = DAYS.between(initTimelineStart, initTimelineEnd);
        long newDaysBetween = DAYS.between(currentTimelineStart, currentTimelineEnd);
        double factor = (double) newDaysBetween / oldDaysBetween;

        for (Milestone m : sessionTimeline.getMilestones()) {
            long oldMilestoneRelativePosition = DAYS.between(initTimelineStart, m.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            m.setDate(currentTimelineStart.plusDays(newMilestoneRelativePosition));
        }

        for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
            long oldMilestoneRelativePosition = DAYS.between(initTimelineStart, temp.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            temp.setDate(currentTimelineStart.plusDays(newMilestoneRelativePosition));
        }

        updateIncrements(timeline.getId());
    }

    public void updateMilestoneStatus(final Long timelineId, final Long milestoneId, final Milestone.StatusEnum status) {
        final TimelineState sessionTimeline = getSessionTimelines().get(timelineId);
        final Milestone updatedMilestone = sessionTimeline.getMilestones().stream().filter(m -> m.getId().equals(milestoneId)).findFirst().orElse(null);
        updatedMilestone.setStatus(status);
    }

}