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
import online.dipa.hub.persistence.entities.ProjectTypeEntity;
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
            }
            else {
                sessionTimeline.setMilestones(this.loadMilestones(timelineId, 0));
            }
        }
    }

    private List<Milestone> loadMilestones(final Long timelineId, final int incrementCount) {

        List<Milestone> milestones = getMilestonesFromRespository(timelineId);

        if (incrementCount == 0) {
            return milestones;
        }
        else {
            List<Milestone> incrementMilestones = new ArrayList<Milestone>();

            incrementMilestones.add(milestones.get(0));
            incrementMilestones.add(milestones.get(milestones.size() - 1));

            for (Entry<Increment, List<Milestone>> entry : getIncrementMilestones(milestones, timelineId, incrementCount).entrySet()) {
                List<Milestone> milestonesList = entry.getValue();
                incrementMilestones.addAll(milestonesList);
            }

            return incrementMilestones;
        }
    }

    private HashMap<Increment, List<Milestone>> getIncrementMilestones(List<Milestone> initMilestones,
            final Long timelineId,
            final int incrementCount) {

        LocalDate firstDatePeriod = initMilestones.stream().map(Milestone::getDate).min(LocalDate::compareTo).get();
        LocalDate lastDatePeriod = initMilestones.stream().map(Milestone::getDate).max(LocalDate::compareTo).get();

        List<Increment> incrementsList = loadIncrements(timelineId, incrementCount);

        List<Milestone> templateMilestones = initMilestones;
        templateMilestones.remove(templateMilestones.size() - 1);
        templateMilestones.remove(0);

        long id = templateMilestones.stream().map(Milestone::getId).min(Long::compareTo).get();
        long count = 0;

        HashMap<Increment, List<Milestone>> hashmapIncrementMilestones = new HashMap<>();
        long oldDaysBetween = DAYS.between(firstDatePeriod, lastDatePeriod);

        for (Increment increment : incrementsList) {
            List<Milestone> incrementMilestones = new ArrayList<Milestone>();

            long newDaysBetween = DAYS.between(increment.getStart(), increment.getEnd());
            double factor = (double) newDaysBetween / oldDaysBetween;

            for (Milestone m : templateMilestones) {

                long daysFromFirstDate = DAYS.between(firstDatePeriod, increment.getStart());
                LocalDate newDateBeforeScale = m.getDate().plusDays(daysFromFirstDate);

                long relativePositionBeforeScale = DAYS.between(increment.getStart(), newDateBeforeScale);
                long newDateAfterScale = (long)(relativePositionBeforeScale * factor);

                Milestone newMilestone = new Milestone();
                newMilestone.setId(id + count);
                newMilestone.setName(m.getName());
                newMilestone.setDate(increment.getStart().plusDays(newDateAfterScale));

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
        }
        else {
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

        return this.sessionTimelines
                .get(timelineId)
                .getIncrements();
    }

    private void initializeIncrements(final Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        sessionTimeline.setIncrements(this.loadIncrements(timelineId, 1));
    }

    private List<Increment> loadIncrements(final Long timelineId, final int incrementCount) {

        List<Milestone> milestones = getMilestonesFromRespository(timelineId);

        //delete milestones from masterplan
        milestones.remove(milestones.size() - 1);
        milestones.remove(0);

        LocalDate firstMilestoneDate = milestones.stream().map(Milestone::getDate).min(LocalDate::compareTo).get();
        LocalDate lastMilestoneDate = milestones.stream().map(Milestone::getDate).max(LocalDate::compareTo).get();
        long daysBetween = DAYS.between(firstMilestoneDate.plusDays(1), lastMilestoneDate.minusDays(1));

        long durationIncrement = daysBetween / incrementCount;

        List<Increment> incrementsList = new ArrayList<Increment>();
        long id = 1;

        LocalDate startDateIncrement = firstMilestoneDate.plusDays(1);
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
                endDateIncrement = lastMilestoneDate.minusDays(1);
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
        final ProjectApproachEntity projectApproach = projectApproachRepository.findById(timelineId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format(
                                "Project approach with id: %1$s not found.",
                                timelineId)));
        return projectApproach;
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
        LocalDate newTimelineStart = sessionTimeline.getTimeline().getStart().plusDays(days);
        LocalDate newTimelineEnd = sessionTimeline.getTimeline().getEnd().plusDays(days);

        sessionTimeline.getTimeline().setStart(newTimelineStart);
        sessionTimeline.getTimeline().setEnd(newTimelineEnd);

        for (Milestone m : sessionTimeline.getMilestones()) {
            m.setDate(m.getDate().plusDays(days));
        }
    }

    public void moveTimelineStartByDays(final Long timelineId, final Long days) {

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

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
    }

    public void moveTimelineEndByDays(final Long timelineId, final Long days) {

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

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

}
