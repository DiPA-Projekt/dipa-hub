package online.dipa.hub.services;

import online.dipa.hub.persistence.entities.ProjectApproachEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.SessionScope;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import online.dipa.hub.api.model.*;
import online.dipa.hub.session.model.*;
import online.dipa.hub.session.state.*;

import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;
import javax.persistence.EntityNotFoundException;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
@SessionScope
@Transactional
public class MilestoneService {
    
    protected static final long FIRST_MASTER_MILESTONE_ID = 21;
    protected static final long LAST_MASTER_MILESTONE_ID = 28;

    @Autowired
    private SessionTimelineState sessionTimelineState;

    @Autowired
    private PlanTemplateRepository planTemplateRepository;
    
    @Autowired
    private ConversionService conversionService;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private IncrementService incrementService;

    
    public List<Milestone> getMilestonesForTimeline(final Long timelineId) {
        initializeMilestones(timelineId);

        return sessionTimelineState.getSessionTimelines().get(timelineId).getMilestones();
    }

    void initializeMilestones(final Long timelineId) {
        SessionTimeline sessionTimeline = sessionTimelineState.findTimelineState(timelineId);

        final ProjectApproachEntity projectApproach = timelineService.findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());

        if (projectApproach != null && sessionTimeline.getMilestones() == null) {
            if (projectApproach.isIterative()) {
                incrementService.initializeIncrements(timelineId);
                sessionTimeline.setMilestones(this.loadMilestones(timelineId, 1));
            } else {
                sessionTimeline.setMilestones(this.loadMilestones(timelineId, 0));
            }
        }
    }

    protected List<Milestone> loadMilestones(final Long timelineId, final int incrementCount) {
        SessionTimeline sessionTimeline = sessionTimelineState.findTimelineState(timelineId);

        List<Milestone> milestones;

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

            List<Milestone> incrementMilestones = new ArrayList<>();

            // add master plan into milestones list
            if (sessionTimeline.getMilestones() == null) {

                incrementMilestones.add(milestones.get(0));
                incrementMilestones.add(milestones.get(milestones.size() - 1));
            } else {

                List<Milestone> currentMilestones = sessionTimeline.getMilestones();

                incrementMilestones.add(currentMilestones.get(0));
                incrementMilestones.add(currentMilestones.get(currentMilestones.size() - 1));

            }

            milestones.removeIf(m -> m.getId().equals(FIRST_MASTER_MILESTONE_ID));
            milestones.removeIf(m -> m.getId().equals(LAST_MASTER_MILESTONE_ID));

            timelineService.getValuesFromHashMap( getIncrementMilestones(milestones, timelineId,
            incrementCount), incrementMilestones);

            return sortMilestones(incrementMilestones);
        }
    }

    HashMap<Increment, List<Milestone>> getIncrementMilestones(List<Milestone> tempMilestones, final Long timelineId,
            final int incrementCount) {

        HashMap<Increment, List<Milestone>> hashmapIncrementMilestones = new HashMap<>();

        SessionTimeline sessionTimeline = sessionTimelineState.findTimelineState(timelineId);

        List<Increment> incrementsList = incrementService.loadIncrementsTemplate(timelineId, incrementCount, tempMilestones, sessionTimeline.getMilestones());

        Optional<LocalDate> firstDatePeriodOptional = tempMilestones.stream().map(Milestone::getDate).min(LocalDate::compareTo);
        Optional<LocalDate> lastDatePeriodOptional = tempMilestones.stream().map(Milestone::getDate).max(LocalDate::compareTo);

        if (firstDatePeriodOptional.isPresent() && lastDatePeriodOptional.isPresent()) {
            LocalDate firstDatePeriod = firstDatePeriodOptional.get();
            LocalDate lastDatePeriod = lastDatePeriodOptional.get();

            long oldDaysBetween = DAYS.between(firstDatePeriod, lastDatePeriod);

            long id = tempMilestones.stream().map(Milestone::getId).min(Long::compareTo).orElseThrow(() -> new EntityNotFoundException(
                    String.format("Timeline with id: %1$s milestone has no id.", timelineId)));
            long count = 0;

            for (Increment increment : incrementsList) {
                List<Milestone> incrementMilestones = new ArrayList<>();

                long newDaysBetween = DAYS.between(increment.getStart().plusDays(14), increment.getEnd());
                LocalDate newStartDateIncrement = increment.getStart().plusDays(14);

                double factor = (double) newDaysBetween / oldDaysBetween;

                for (Milestone m : tempMilestones) {

                    long daysFromFirstDate = DAYS.between(firstDatePeriod, newStartDateIncrement);
                    LocalDate newDateBeforeScale = m.getDate().plusDays(daysFromFirstDate);

                    long relativePositionBeforeScale = DAYS.between(newStartDateIncrement, newDateBeforeScale);
                    long newDateAfterScale = (long)(relativePositionBeforeScale * factor);
                    long milestoneId = id + count;

                    String milestoneName = m.getName();
                    LocalDate milestoneDate = increment.getStart().plusDays(newDateAfterScale).plusDays(14);

                    Milestone newMilestone = createMilestone(sessionTimeline, milestoneId, milestoneName, milestoneDate);
                    incrementMilestones.add(newMilestone);

                    count++;
                }
                hashmapIncrementMilestones.put(increment, incrementMilestones);

            }

        }
        return hashmapIncrementMilestones;
    }


    private Milestone createMilestone(SessionTimeline sessionTimeline, long milestoneId, String milestoneName, LocalDate milestoneDate) {
        Milestone newMilestone = new Milestone();
        newMilestone.setId(milestoneId);
        newMilestone.setName(milestoneName);
        newMilestone.setDate(milestoneDate);

        if (sessionTimeline.getMilestones() != null) {
            Milestone oldMilestone = sessionTimeline.getMilestones().stream().filter(milestone -> milestone.getId().equals(milestoneId)).findFirst().orElse(null);

            if (oldMilestone != null) {
                newMilestone.setStatus(oldMilestone.getStatus());
            } else {
                newMilestone.setStatus(Milestone.StatusEnum.OPEN);
            }
        }
        else {
            newMilestone.setStatus(Milestone.StatusEnum.OPEN);
        }

        return newMilestone;
    }

    List<Milestone> getMilestonesFromRespository(final Long timelineId) {
        SessionTimeline sessionTimeline = sessionTimelineState.findTimelineState(timelineId);

        final ProjectApproachEntity projectApproach = timelineService.findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());

        List<Milestone> milestones = new ArrayList<>();

        if (projectApproach != null) {

            Long operationTypeId = projectApproach.getOperationType().getId();

            Optional<PlanTemplateEntity> masterPlanTemplate = planTemplateRepository.findAll().stream()
                .filter(template -> timelineService.filterOperationType(template, operationTypeId)).findFirst();

            masterPlanTemplate.ifPresent(planTemplate -> milestones.addAll(convertMilestones(planTemplate)));


            Optional<PlanTemplateEntity> planTemplate = planTemplateRepository.findAll().stream()
                    .filter(template -> template.getProjectApproaches() != null)
                    .filter(template -> timelineService.filterProjectApproach(template, projectApproach.getId()))
                    .filter(PlanTemplateEntity::getDefaultTemplate)
                    .findFirst();

            planTemplate.ifPresent(template -> milestones.addAll(convertMilestones(template)));

        }

        return sortMilestones(milestones);
    }

    List<Milestone> convertMilestones(PlanTemplateEntity planTemplate) {
        return planTemplate.getMilestones().stream().map(m -> conversionService.convert(m, Milestone.class))
                .sorted(Comparator.comparing(Milestone::getDate)).collect(Collectors.toList());
    }

    List<Milestone> sortMilestones(List<Milestone> milestones) {
         return milestones.stream().map(m -> conversionService.convert(m, Milestone.class))
        .sorted(Comparator.comparing(Milestone::getDate)).collect(Collectors.toList());
    }


    void updateTempMilestones(final Long timelineId) {

        SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);

        if (sessionTimeline.getTempIncrementMilestones() == null) {

            List<Milestone> tempMilestonesList = new ArrayList<>(getMilestonesFromRespository(timelineId));
            sessionTimeline.setTempIncrementMilestones(tempMilestonesList);
        }
    }

    public void updateMilestoneStatus(final Long timelineId, final Long milestoneId, final Milestone.StatusEnum status) {
        final SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);
        final Milestone updatedMilestone = sessionTimeline.getMilestones().stream().filter(m -> m.getId().equals(milestoneId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                String.format("Milestone with id: %1$s not found.", milestoneId)));

        updatedMilestone.setStatus(status);
    }

    public void updateMilestonesAndIncrement(final Timeline timeline) {

        SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timeline.getId());

        this.updateTempMilestones(timeline.getId());

        LocalDate initTimelineStart = LocalDate.now();
        Optional<LocalDate> initTimelineEndOptional = sessionTimeline.getMilestones().stream().map(Milestone::getDate).max(LocalDate::compareTo);

        if (initTimelineEndOptional.isPresent()) {
            LocalDate initTimelineEnd = initTimelineEndOptional.get();

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

            incrementService.updateIncrements(timeline.getId());
        }
    }

}
