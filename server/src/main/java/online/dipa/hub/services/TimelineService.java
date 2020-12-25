package online.dipa.hub.services;

import net.fortuna.ical4j.model.TimeZone;
import online.dipa.hub.IcsCalendar;
import online.dipa.hub.TimelineState;
import online.dipa.hub.api.model.Increment;
import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.ProjectApproach;
import online.dipa.hub.api.model.ProjectType;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;
import online.dipa.hub.persistence.repositories.ProjectApproachRepository;
import online.dipa.hub.persistence.repositories.ProjectTypeRepository;

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
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private ProjectApproachRepository projectApproachRepository;

    @Autowired
    private ProjectTypeRepository projectTypeRepository;

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
        projectApproachRepository.findAll().stream().map(p -> conversionService.convert(p, Timeline.class))
                .forEach(t -> {
                    TimelineState sessionTimeline = findTimelineState(t.getId());
                    if (sessionTimeline.getTimeline() == null) {
                        sessionTimeline.setTimeline(t);
                    }
                });
    }

    public List<ProjectType> getProjectTypes() {

        return projectTypeRepository.findAll().stream().map(p -> conversionService.convert(p, ProjectType.class))
        .collect(Collectors.toList());
    }

    public List<ProjectApproach> getProjectApproaches() {

        return projectApproachRepository.findAll().stream().map(p -> conversionService.convert(p, ProjectApproach.class))
        .collect(Collectors.toList());
    }

    public List<Milestone> getMilestonesForTimeline(final Long timelineId) {
        initializeMilestones(timelineId);

        return this.sessionTimelines
                .get(timelineId)
                .getMilestones();
    }

    private void initializeMilestones(final Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        final ProjectApproachEntity projectApproach = findProjectApproach(timelineId);

        if (sessionTimeline.getMilestones() == null) {
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
        if (sessionTimeline.getTempIncrementMilestones() == null){
            milestones = getMilestonesFromRespository(timelineId);
        }
        else {
            milestones = new ArrayList<>(sessionTimeline.getTempIncrementMilestones());
        }

        //get initial milestones
        if (incrementCount == 0) {

            return milestones;
        } else {

            List<Milestone> incrementMilestones = new ArrayList<Milestone>();

            //add master plan into milestones list
            if (sessionTimeline.getMilestones() == null) {

                incrementMilestones.add(milestones.get(0));
                incrementMilestones.add(milestones.get(milestones.size() - 1));
            }
            else {

                List<Milestone> currentMilestones = sessionTimeline.getMilestones();

                incrementMilestones.add(currentMilestones.get(0));
                incrementMilestones.add(currentMilestones.get(currentMilestones.size() - 1));         
            }

            for (Entry<Increment, List<Milestone>> entry : getIncrementMilestones(milestones, timelineId, incrementCount).entrySet()) {
                List<Milestone> milestonesList = entry.getValue();
                incrementMilestones.addAll(milestonesList);
            }

            return incrementMilestones.stream()
            .map(m -> conversionService.convert(m, Milestone.class))
            .sorted(Comparator.comparing(Milestone::getDate))
            .collect(Collectors.toList());
        }
    }

    private HashMap<Increment, List<Milestone>> getIncrementMilestones(List<Milestone> initMilestones,
            final Long timelineId,
            final int incrementCount) {

        List<Increment> incrementsList = loadIncrements(timelineId, incrementCount);

        initMilestones.remove(initMilestones.size() - 1);
        initMilestones.remove(0);

        LocalDate firstDatePeriod =  initMilestones.stream().map(Milestone::getDate).min(LocalDate::compareTo).get();
        LocalDate lastDatePeriod = initMilestones.stream().map(Milestone::getDate).max(LocalDate::compareTo).get();

        long id = initMilestones.stream().map(Milestone::getId).min(Long::compareTo).get();
        long count = 0;
        
        HashMap<Increment, List<Milestone>> hashmapIncrementMilestones = new HashMap<>();
        long oldDaysBetween = DAYS.between(firstDatePeriod, lastDatePeriod);

        for (Increment increment : incrementsList) {
            List<Milestone> incrementMilestones = new ArrayList<Milestone>();

            LocalDate newStartDateIncrement = increment.getStart().plusDays(14);

            long newDaysBetween = DAYS.between(newStartDateIncrement, increment.getEnd());
            double factor = (double) newDaysBetween / oldDaysBetween;

            for (Milestone m : initMilestones) {

                long daysFromFirstDate = DAYS.between(firstDatePeriod, newStartDateIncrement);
                LocalDate newDateBeforeScale = m.getDate().plusDays(daysFromFirstDate);

                long relativePositionBeforeScale = DAYS.between(newStartDateIncrement, newDateBeforeScale);
                long newDateAfterScale = (long)(relativePositionBeforeScale * factor);

                Milestone newMilestone = new Milestone();
                newMilestone.setId(id + count);
                newMilestone.setName(m.getName());
                //plus 14 days for planning
                newMilestone.setDate(increment.getStart().plusDays(newDateAfterScale + 14));

                incrementMilestones.add(newMilestone);

                count++;
            }
            hashmapIncrementMilestones.put(increment, incrementMilestones);

        }

        return hashmapIncrementMilestones;
    }

    private List<Milestone> getMilestonesFromRespository(final Long timelineId) {

        final ProjectApproachEntity projectApproach = findProjectApproach(timelineId);

        Long projectTypeId = projectApproach.getProjectType().getId();

        final List<PlanTemplateEntity> planTemplateList = planTemplateRepository.findAll().stream()
                                                        .filter(template -> template.getProjectTypeEntity().getId().equals(projectTypeId))
                                                        .collect(Collectors.toList());

        List<Milestone> milestones = new ArrayList<Milestone>();

        if (planTemplateList.size() == 1) {
            milestones = convertMilestones(planTemplateList.get(0));
        } else {
            long masterPlanId = 2;
            PlanTemplateEntity masterPlan = planTemplateList.stream().filter(template -> template.getId().equals(masterPlanId)).findFirst().orElse(null);

            milestones.addAll(convertMilestones(masterPlan));

            PlanTemplateEntity iterativePlan = planTemplateList.stream().filter(template -> template.getProjectApproach() != null)
            .filter(template -> template.getProjectApproach().getId().equals(projectApproach.getId())).findFirst().orElse(null);

            milestones.addAll(convertMilestones(iterativePlan));
        }

        return milestones.stream()
        .map(m -> conversionService.convert(m, Milestone.class))
        .sorted(Comparator.comparing(Milestone::getDate))
        .collect(Collectors.toList());
    }

    private List<Milestone> convertMilestones(PlanTemplateEntity planTemplate) {
        return planTemplate
                .getMilestones()
                .stream()
                .map(m -> conversionService.convert(m, Milestone.class))
                .sorted(Comparator.comparing(Milestone::getDate))
                .collect(Collectors.toList());
    }

    public List<Increment> getIncrementsForTimeline(final Long timelineId) {

        // initializeMilestones(timelineId);
        initializeIncrements(timelineId);

        List<Increment> result = this.sessionTimelines
                .get(timelineId)
                .getIncrements();

        return Objects.requireNonNullElse(result, Collections.emptyList());
    }

    private void initializeIncrements(final Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        if (sessionTimeline.getIncrements() == null) {
            final ProjectApproachEntity projectApproach = findProjectApproach(timelineId);
            if (projectApproach.isIterative()) {
                sessionTimeline.setIncrements(this.loadIncrements(timelineId, 1));
            }
        }
    }

    private List<Increment> loadIncrements(final Long timelineId, final int incrementCount) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        List<Milestone> milestones = getMilestonesFromRespository(timelineId);

        //delete masterplan from milestones list
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

            if (i == (incrementCount -2)){
                endDateIncrement = lastMilestoneDate;
            }
            else {
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

        if (incrementCount != 1){
            sessionTimeline.setIncrements(this.loadIncrements(timelineId, incrementCount - 1));
            sessionTimeline.setMilestones(this.loadMilestones(timelineId, incrementCount - 1));
        }
    }

    private ProjectApproachEntity findProjectApproach(Long timelineId) {
        return projectApproachRepository.findById(timelineId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format(
                                "Project approach with id: %1$s not found.",
                                timelineId)));
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

        for (Milestone temp :  sessionTimeline.getTempIncrementMilestones()) {
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

        LocalDate oldFirstMilestoneDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate).min(LocalDate::compareTo).get();
        LocalDate oldProjectStart = sessionTimeline.getTimeline().getStart();
        long diffProjectStartMilestone = Duration.between(oldFirstMilestoneDate.atStartOfDay(), oldProjectStart.atStartOfDay()).toDays();

        for (Milestone m : sessionTimeline.getMilestones()) {
            if (m.getId().equals(movedMilestoneId)) {
                m.setDate(m.getDate().plusDays(days));
            }
        }

        LocalDate newFirstMilestoneDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate).min(LocalDate::compareTo).get();
        long daysOffsetStart = Duration.between(oldProjectStart.atStartOfDay(), newFirstMilestoneDate.atStartOfDay()).toDays();
        LocalDate newProjectStart = sessionTimeline.getTimeline().getStart().plusDays(daysOffsetStart + diffProjectStartMilestone);

        LocalDate newLastMilestoneDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate).max(LocalDate::compareTo).get();
        LocalDate oldProjectEnd = sessionTimeline.getTimeline().getEnd();

        long daysOffsetEnd = Duration.between(oldProjectEnd.atStartOfDay(), newLastMilestoneDate.atStartOfDay()).toDays();
        LocalDate newProjectEnd = sessionTimeline.getTimeline().getEnd().plusDays(daysOffsetEnd);

        sessionTimeline.getTimeline().setStart(newProjectStart);
        sessionTimeline.getTimeline().setEnd(newProjectEnd);
    }

    public File getCalendarFileForTimeline(final Long timelineId) throws IOException {

        IcsCalendar icsCalendar = new IcsCalendar();
        TimeZone timezone = icsCalendar.createTimezoneEurope();

        final ProjectApproachEntity projectApproach = findProjectApproach(timelineId);

        List<Milestone> milestones = getMilestonesForTimeline(timelineId);
        for(Milestone milestone: milestones) {
            LocalDate eventDate = milestone.getDate();
            String eventTitle = milestone.getName() + " - " + projectApproach.getName();
            String eventComment = "Test Comment";

            icsCalendar.addEvent(timezone, eventDate, eventTitle, eventComment);
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

        if (sessionTimeline.getTempIncrementMilestones() == null){

            List<Milestone> tempMilestonesList = new ArrayList<Milestone>(getMilestonesFromRespository(timelineId));
            sessionTimeline.setTempIncrementMilestones(tempMilestonesList);
        }
    }

}