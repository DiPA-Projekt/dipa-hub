package online.dipa.hub.services;

import online.dipa.hub.TimelineState;
import online.dipa.hub.api.model.Increment;
import online.dipa.hub.api.model.Milestone;
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

import liquibase.hub.model.Project;

import javax.persistence.EntityNotFoundException;
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
    private ProjectApproachRepository projectApproachRepository;

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    public List<Timeline> getTimelines() {
        initializeTimelines();

        return this.sessionTimelines.values().stream().map(TimelineState::getTimeline).collect(Collectors.toList());
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

    public List<Milestone> getMilestonesForTimeline(final Long timelineId) {
        initializeMilestones(timelineId);

        return this.sessionTimelines
                .get(timelineId)
                .getMilestones();
    }

    private void initializeMilestones(final Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);
        Long incrementSessionTimeline = sessionTimeline.getIncrementCount();

        if (sessionTimeline.getMilestones() == null) {
            sessionTimeline.setMilestones(this.loadMilestones(timelineId, incrementSessionTimeline));
        }
    }

    private List<Milestone> loadMilestones(final Long timelineId, final Long incrementCount) {

        List<Milestone> milestones = getMilestonesFromRespository(timelineId);

        if (incrementCount == null) {
            return milestones;
        } else {
            System.out.println("not null");
            return milestonesIncrement(milestones, timelineId, incrementCount);
        }
    }

    private List<Milestone> milestonesIncrement(List<Milestone> initMilestones, final Long timelineId,
            final Long incrementCount) {

        LocalDate firstDatePeriod = initMilestones.stream().map(Milestone::getDate).min(LocalDate::compareTo).get();
        LocalDate lastDatePeriod = initMilestones.stream().map(Milestone::getDate).max(LocalDate::compareTo).get();

        List<Milestone> scheduleMilestones = new ArrayList<Milestone>();

        scheduleMilestones.add(initMilestones.get(0));
        scheduleMilestones.add(initMilestones.get(initMilestones.size() - 1));

        List<Increment> incrementsList = loadIncrements(timelineId, incrementCount);

        List<Milestone> templateMilestones = initMilestones;
        templateMilestones.remove(templateMilestones.size() - 1);
        templateMilestones.remove(0);
        long id = templateMilestones.stream().map(Milestone::getId).min(Long::compareTo).get();

        long count = 0;

        HashMap<Increment, List<Milestone>> hashMilestonesIncrement = new HashMap<>();

        for (Increment increment : incrementsList) {
            List<Milestone> tempMilestones = new ArrayList<Milestone>();
            for (Milestone m : templateMilestones) {

                long newDaysBetween = DAYS.between(firstDatePeriod, increment.getStart().minusDays(1));

                Milestone newMilestone = new Milestone();
                newMilestone.setId(id + count);
                newMilestone.setDate(m.getDate().plusDays(newDaysBetween));
                newMilestone.setName(m.getName());
                tempMilestones.add(newMilestone);

                count++;
            }
            hashMilestonesIncrement.put(increment, tempMilestones);

        }
        
        long oldDaysBetween = DAYS.between(firstDatePeriod, lastDatePeriod);
        
        for (Entry<Increment, List<Milestone>> entry : hashMilestonesIncrement.entrySet()) {
            Increment increment = entry.getKey();
            List<Milestone> milestonesList = entry.getValue();
            long newDaysBetween = DAYS.between(increment.getStart().minusDays(1), increment.getEnd());
            double factor = (double)newDaysBetween / oldDaysBetween;

            for (Milestone m : milestonesList) {

                long oldMilestoneRelativePosition = DAYS.between(increment.getStart(), m.getDate());
                long newMilestoneRelativePosition = (long)(oldMilestoneRelativePosition * factor);
    
                m.setDate(increment.getStart().plusDays(newMilestoneRelativePosition));
            }

            scheduleMilestones.addAll(milestonesList);
        }
        
        return scheduleMilestones;        
    }
    
    private List<Milestone> getMilestonesFromRespository(final Long timelineId) {
        // System.out.println(timelineId);

        final ProjectApproachEntity projectApproach = projectApproachRepository.findById(timelineId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format(
                                "Project approach with id: %1$s not found.",
                                timelineId)));

        Long projectTypeId = projectApproach.getProjectType().getId();    

        final List<PlanTemplateEntity> planTemplateList = planTemplateRepository.findAll().stream()
                                                        .filter(template -> template.getProjectTypeEntity().getId().equals(projectTypeId))
                                                        .collect(Collectors.toList());
        
        List<Milestone> milestones = new ArrayList<Milestone>();

        if (planTemplateList.size() == 1) {
            milestones = planTemplateList.get(0)
                                            .getMilestones()
                                            .stream()
                                            .map(m -> conversionService.convert(m, Milestone.class))
                                            .sorted(Comparator.comparing(Milestone::getDate))
                                            .collect(Collectors.toList());
        } else {
            long id = 2;
            PlanTemplateEntity masterPlan = planTemplateList.stream().filter(template -> template.getId().equals(id)).findFirst().orElse(null);
            
            milestones.addAll(masterPlan.getMilestones()
                                .stream()
                                .map(m -> conversionService.convert(m, Milestone.class))
                                .sorted(Comparator.comparing(Milestone::getDate))
                                .collect(Collectors.toList()));
       

            PlanTemplateEntity iterativPlan = planTemplateList.stream().filter(template -> template.getProjectApproach() != null).filter(template -> template.getProjectApproach().getId().equals(projectApproach.getId())).findFirst().orElse(null);
            
            milestones.addAll(iterativPlan.getMilestones()
            .stream()
            .map(m -> conversionService.convert(m, Milestone.class))
            .sorted(Comparator.comparing(Milestone::getDate))
            .collect(Collectors.toList()));
        }
        
        return milestones.stream()
        .map(m -> conversionService.convert(m, Milestone.class))
        .sorted(Comparator.comparing(Milestone::getDate))
        .collect(Collectors.toList());
    }

    public List<Increment> getIncrementsForTimeline(final Long timelineId) {
        updateIncrements(timelineId);

        return this.sessionTimelines
                .get(timelineId)
                .getIncrements();
    }

    private void updateIncrements(final Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);
        Long incrementCountSessionTimeline = sessionTimeline.getIncrementCount();
        sessionTimeline.setIncrements(this.loadIncrements(timelineId, incrementCountSessionTimeline));
        
    }

    private List<Increment> loadIncrements(final Long timelineId, final Long incrementCount) {
        System.out.println("'hallo'");
        System.out.println(incrementCount);

        List<Milestone> milestones = getMilestonesFromRespository(timelineId);

        LocalDate firstMilestoneDate = milestones.stream().map(Milestone::getDate).min(LocalDate::compareTo).get();
        LocalDate lastMilestoneDate = milestones.stream().map(Milestone::getDate).max(LocalDate::compareTo).get();
        long daysBetween = DAYS.between(firstMilestoneDate, lastMilestoneDate);

        long durationIncrement = daysBetween / incrementCount;

        List<Increment> incrementsList = new ArrayList<Increment>();
        long id = 0;

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
            endDateIncrement = endDateIncrement.plusDays(durationIncrement);

        }
        return incrementsList;

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

    public void setIncrementTimeline(Long timelineId, Long increment) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        sessionTimeline.setIncrementCount(increment);
        updateIncrements(timelineId);
        sessionTimeline.setMilestones(this.loadMilestones(timelineId, increment));
        System.out.println(increment);

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
        double factor = (double)newDaysBetween / oldDaysBetween;

        LocalDate newTimelineStart = timelineStart.plusDays(days);
        sessionTimeline.getTimeline().setStart(newTimelineStart);

        for (Milestone m : sessionTimeline.getMilestones()) {
            long oldMilestoneRelativePosition = DAYS.between(timelineStart, m.getDate());
            long newMilestoneRelativePosition = (long)(oldMilestoneRelativePosition * factor);

            m.setDate(newTimelineStart.plusDays(newMilestoneRelativePosition));
        }
    }

    public void moveTimelineEndByDays(final Long timelineId, final Long days) {

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

        LocalDate timelineStart = sessionTimeline.getTimeline().getStart();
        LocalDate timelineEnd = sessionTimeline.getTimeline().getEnd();

        long oldDaysBetween = DAYS.between(timelineStart, timelineEnd);
        long newDaysBetween = oldDaysBetween + days;
        double factor = (double)newDaysBetween / oldDaysBetween;

        LocalDate newTimelineEnd = timelineEnd.plusDays(days);
        sessionTimeline.getTimeline().setEnd(newTimelineEnd);

        for (Milestone m : sessionTimeline.getMilestones()) {
            long oldMilestoneRelativePosition = DAYS.between(timelineStart, m.getDate());
            long newMilestoneRelativePosition = (long)(oldMilestoneRelativePosition * factor);

            m.setDate(timelineStart.plusDays(newMilestoneRelativePosition));
        }
    }

    public void moveMileStoneByDays (final Long timelineId, final Long days, final Long movedMilestoneId) {
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

}
