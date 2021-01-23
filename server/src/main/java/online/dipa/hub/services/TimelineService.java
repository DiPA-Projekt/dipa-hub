package online.dipa.hub.services;

import net.fortuna.ical4j.model.TimeZone;
import online.dipa.hub.IcsCalendar;
import online.dipa.hub.TimelineState;
import online.dipa.hub.api.model.Increment;
import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.ProjectApproach;
import online.dipa.hub.api.model.Template;
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
    private Map<Long, List<Template>> sessionTemplates = new HashMap<>();

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

    private static final long masterPlanStartMilestoneId = 21;
    private static final long masterPlanEndMilestoneId = 28;
    private static final String CURRENT_TEMPLATE_NAME = "aktuell";

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
            
            milestones.removeIf(m -> m.getId().equals(masterPlanStartMilestoneId));
            milestones.removeIf(m -> m.getId().equals(masterPlanEndMilestoneId));
            
            for (Entry<Increment, List<Milestone>> entry : getIncrementMilestones(milestones, timelineId,
                    incrementCount).entrySet()) {
                List<Milestone> milestonesList = entry.getValue();
                incrementMilestones.addAll(milestonesList);
            }

            return sortMilestones(incrementMilestones);
        }
    }

    private HashMap<Increment, List<Milestone>> getIncrementMilestones(List<Milestone> tempMilestones,
            final Long timelineId, final int incrementCount) {

        HashMap<Increment, List<Milestone>> hashmapIncrementMilestones = new HashMap<>();

        TimelineState sessionTimeline = findTimelineState(timelineId);

        List<Increment> incrementsList = loadIncrementsTemplate(timelineId, incrementCount, tempMilestones, sessionTimeline.getMilestones());


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

    private Milestone createMilestone(TimelineState sessionTimeline, long milestoneId, String milestoneName, LocalDate milestoneDate) {
        Milestone newMilestone = new Milestone();
        newMilestone.setId(milestoneId);
        newMilestone.setName(milestoneName);
        newMilestone.setDate(milestoneDate);

        if (sessionTimeline.getMilestones() != null) {
            Milestone oldMilestone = sessionTimeline.getMilestones().stream().filter(milestone -> milestone.getId().equals(milestoneId)).findFirst().orElse(null);

            if (oldMilestone != null) {
                newMilestone.setStatus(oldMilestone.getStatus());
            } else {
                newMilestone.setStatus(Milestone.StatusEnum.OFFEN);
            }
        }
        else {
            newMilestone.setStatus(Milestone.StatusEnum.OFFEN);
        }

        return newMilestone;
    }

    private List<Milestone> getMilestonesFromRespository(final Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        final ProjectApproachEntity projectApproach = findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());

        List<Milestone> milestones = new ArrayList<>();

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

                    Optional<PlanTemplateEntity> masterPlanTemplate = planTemplateList.stream()
                            .filter(template -> template.getId().equals(masterPlanId))
                            .filter(PlanTemplateEntity::getDefaultTemplate).findFirst();
                
                    if (masterPlanTemplate.isPresent()) {
                        milestones.addAll(convertMilestones(masterPlanTemplate.get()));
                    }
        
                    Optional<PlanTemplateEntity> planTemplate = planTemplateList.stream()
                            .filter(template -> template.getProjectApproach() != null)
                            .filter(template -> template.getProjectApproach().getId().equals(projectApproach.getId()))
                            .filter(PlanTemplateEntity::getDefaultTemplate)
                            .findFirst();
                    
                    if (planTemplate.isPresent()) {
                        milestones.addAll(convertMilestones(planTemplate.get()));
                    }

                }

        }

        return sortMilestones(milestones);
    }

    private List<Milestone> convertMilestones(PlanTemplateEntity planTemplate) {
        return planTemplate.getMilestones().stream().map(m -> conversionService.convert(m, Milestone.class))
                .sorted(Comparator.comparing(Milestone::getDate)).collect(Collectors.toList());
    }

    private List<Milestone> sortMilestones(List<Milestone> milestones) {
         return milestones.stream().map(m -> conversionService.convert(m, Milestone.class))
        .sorted(Comparator.comparing(Milestone::getDate)).collect(Collectors.toList());
    }

    public List<Increment> getIncrementsForTimeline(final Long timelineId) {

        initializeIncrements(timelineId);

        List<Increment> result = this.sessionTimelines.get(timelineId).getIncrements();

        return Objects.requireNonNullElse(result, Collections.emptyList());
    }

    private void initializeIncrements(final Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);
        List<Template> currentSessionTemplates = this.sessionTemplates.get(timelineId);

        if (sessionTimeline.getIncrements() == null) {
            final ProjectApproachEntity projectApproach = projectRespository.findAll().stream()
            .filter(p -> p.getProjectApproach().getId().equals(sessionTimeline.getTimeline().getProjectApproachId())).findFirst().orElseThrow(() -> new EntityNotFoundException(
                            String.format("No project approach available for timeline id: %1$s.", timelineId))).getProjectApproach();

            if (projectApproach.isIterative()) {
                
                if (currentSessionTemplates == null || sessionTimeline.getIterative()) {
                    List<Milestone> initMilestones = getMilestonesFromRespository(timelineId);
                    sessionTimeline.setIncrements(this.loadIncrementsTemplate(timelineId, 1, initMilestones, null));
                }
            }
    
        }
    }

    private List<Increment> loadIncrementsTemplate(final Long timelineId, final int incrementCount, List<Milestone> initMilestones, List<Milestone> currentMilestones) {

        LocalDate firstMilestoneDate;
        LocalDate lastMilestoneDate;
        long daysBetween;
        List<Increment> incrementsList = new ArrayList<>();

        if (currentMilestones == null) {
            initMilestones = sortMilestones(initMilestones);

            // initMilestones.remove(initMilestones.size() - 1);
            initMilestones.removeIf(m -> m.getId().equals(masterPlanStartMilestoneId));
            initMilestones.removeIf(m -> m.getId().equals(masterPlanEndMilestoneId));

            //minus 14 days for "Inkrement geplant"
            firstMilestoneDate = initMilestones.stream().map(Milestone::getDate).min(LocalDate::compareTo).orElseThrow(() -> new EntityNotFoundException(
                    String.format("No valid milestone date available for timeline id: %1$s.", timelineId))).minusDays(14);
            lastMilestoneDate = initMilestones.stream().map(Milestone::getDate).max(LocalDate::compareTo).orElseThrow(() -> new EntityNotFoundException(
                    String.format("No valid milestone date available for timeline id: %1$s.", timelineId)));

        } else {

            currentMilestones = sortMilestones(currentMilestones);

            firstMilestoneDate = currentMilestones.get(1).getDate().minusDays(14);
            lastMilestoneDate = currentMilestones.get(currentMilestones.size() - 2).getDate();

        }
        daysBetween = DAYS.between(firstMilestoneDate, lastMilestoneDate);

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

        sessionTimeline.setIncrements(this.loadIncrementsTemplate(timelineId, incrementCount + 1, null, sessionTimeline.getMilestones()));
        sessionTimeline.setMilestones(this.loadMilestones(timelineId, incrementCount + 1));
    }

    public void deleteIncrement(Long timelineId) {
        TimelineState sessionTimeline = findTimelineState(timelineId);

        int incrementCount = sessionTimeline.getIncrements().size();

        if (incrementCount != 1) {
            sessionTimeline.setIncrements(this.loadIncrementsTemplate(timelineId, incrementCount - 1, null, sessionTimeline.getMilestones()));
            sessionTimeline.setMilestones(this.loadMilestones(timelineId, incrementCount - 1));
        }
    }

    private ProjectApproachEntity findProjectApproach(Long projectApproachId) {
        return projectRespository.findAll().stream()
        .filter(p -> p.getProjectApproach().getId().equals(projectApproachId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Project approach with id: %1$s not found.", projectApproachId))).getProjectApproach();
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
        // long endMilestoneId = 28;

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

        Optional<LocalDate> oldFirstMilestoneOptionalDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
                .min(LocalDate::compareTo);
        if (oldFirstMilestoneOptionalDate.isPresent()) {
            LocalDate oldFirstMilestoneDate = oldFirstMilestoneOptionalDate.get();

            LocalDate oldProjectStart = sessionTimeline.getTimeline().getStart();
            long diffProjectStartMilestone = Duration
                    .between(oldFirstMilestoneDate.atStartOfDay(), oldProjectStart.atStartOfDay()).toDays();

            for (Milestone m : sessionTimeline.getMilestones()) {
                if (m.getId().equals(movedMilestoneId)) {
                    m.setDate(m.getDate().plusDays(days));
                }
            }

            Optional<LocalDate> newFirstMilestoneOptionalDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
                    .min(LocalDate::compareTo);
            if (newFirstMilestoneOptionalDate.isPresent()) {
                LocalDate newFirstMilestoneDate = newFirstMilestoneOptionalDate.get();

                long daysOffsetStart = Duration.between(oldProjectStart.atStartOfDay(), newFirstMilestoneDate.atStartOfDay())
                        .toDays();
                LocalDate newProjectStart = sessionTimeline.getTimeline().getStart()
                        .plusDays(daysOffsetStart + diffProjectStartMilestone);

                sessionTimeline.getTimeline().setStart(newProjectStart);
            }

            Optional<LocalDate> newLastMilestoneOptionalDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
                    .max(LocalDate::compareTo);
            if (newLastMilestoneOptionalDate.isPresent()) {
                LocalDate newLastMilestoneDate = newLastMilestoneOptionalDate.get();

                LocalDate oldProjectEnd = sessionTimeline.getTimeline().getEnd();

                long daysOffsetEnd = Duration.between(oldProjectEnd.atStartOfDay(), newLastMilestoneDate.atStartOfDay())
                        .toDays();
                LocalDate newProjectEnd = sessionTimeline.getTimeline().getEnd().plusDays(daysOffsetEnd);

                sessionTimeline.getTimeline().setEnd(newProjectEnd);
            }
        }
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
            sessionTimeline.setIncrements(this.loadIncrementsTemplate(timelineId, incrementCount, null, sessionTimeline.getMilestones()));
            // fix sessionTimeline setMilestones

        }
    }

    private void updateTempMilestones(final Long timelineId) {

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

        if (sessionTimeline.getTempIncrementMilestones() == null) {

            List<Milestone> tempMilestonesList = new ArrayList<>(getMilestonesFromRespository(timelineId));
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

            updateIncrements(timeline.getId());
        }
    }

    public void updateMilestoneStatus(final Long timelineId, final Long milestoneId, final Milestone.StatusEnum status) {
        final TimelineState sessionTimeline = getSessionTimelines().get(timelineId);
        final Milestone updatedMilestone = sessionTimeline.getMilestones().stream().filter(m -> m.getId().equals(milestoneId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                String.format("Milestone with id: %1$s not found.", milestoneId)));

        updatedMilestone.setStatus(status);
    }

    public List<Template> getTemplatesForTimeline(final Long timelineId) {

        List<Template> templates = new ArrayList<>();
        final TimelineState sessionTimeline = getSessionTimelines().get(timelineId);
        long count = 0;

        Template currentTemplate = new Template()
                                        .id(count++)
                                        .name(CURRENT_TEMPLATE_NAME)
                                        .milestones(sessionTimeline.getMilestones())
                                        .increments(sessionTimeline.getIncrements());

        templates.add(currentTemplate);

        final ProjectApproachEntity projectApproach = findProjectApproach(sessionTimeline.getTimeline().getProjectApproachId());
        Long operationTypeId = projectApproach.getOperationType().getId();

        final List<PlanTemplateEntity> planTemplateList = planTemplateRepository.findAll().stream()
                .filter(template -> template.getOperationTypeEntity().getId().equals(operationTypeId))
                .collect(Collectors.toList());

        if (planTemplateList.size() == 1) {
            List<Milestone>  milestones = convertMilestones(planTemplateList.get(0));

            Template respoTemplate = new Template().id(count)
                                                    .name(planTemplateList.get(0).getName())
                                                    .standard(planTemplateList.get(0).getStandard())
                                                    .milestones(this.updateMilestonesTemplate(timelineId, milestones));

            templates.add(respoTemplate);
        }
        else {
            long masterPlanId = 2;
            Optional<PlanTemplateEntity> masterPlanTemplate = planTemplateList.stream()
                            .filter(template -> template.getId().equals(masterPlanId)).findFirst();

            List<PlanTemplateEntity> planTemplates = planTemplateList.stream()
                    .filter(template -> template.getProjectApproach() != null)
                    .filter(template -> template.getProjectApproach().getId().equals(projectApproach.getId()))
                    .collect(Collectors.toList());

            for (PlanTemplateEntity temp: planTemplates) {
                List<Milestone> milestones = new ArrayList<>();

                if (masterPlanTemplate.isPresent()) {

                    milestones.addAll(convertMilestones(masterPlanTemplate.get()));
                }

                Template template =  new Template()
                        .id(count++)
                        .name(temp.getName())
                        .standard(temp.getStandard());

                if (projectApproach.isIterative()) {
                    milestones = updateMilestonesTemplate(timelineId, milestones);
              
                    List<Milestone> tempMilestones = new ArrayList<>(convertMilestones(temp));

                    for (Entry<Increment, List<Milestone>> entry : getIncrementMilestones(tempMilestones,timelineId, 1).entrySet()) {
                        List<Milestone> milestonesList = entry.getValue();
                        milestones.addAll(milestonesList);
                    }

                    template.milestones(sortMilestones(milestones));
                    
                    if (temp.getStandard()) {
                        template.increments(loadIncrementsTemplate((long) 1, 1, milestones, null));
                    }

                }
                else {
                    milestones.addAll(convertMilestones(temp));
                    template.milestones(updateMilestonesTemplate(timelineId, milestones));
                }

                templates.add(template);

            }
        }

        this.sessionTemplates.put(timelineId, templates);
        return templates;       
    }

    public List<Milestone> updateMilestonesTemplate(final Long timelineId, List<Milestone> milestones) {

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);
        milestones = sortMilestones(milestones);

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

    public void updateTemplateForProject(final Long timelineId, final Long templateId) {
        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);

        List<Template> currentSessionTemplates = this.sessionTemplates.get(timelineId);
        Optional<Template> selectedTemplateOptional = currentSessionTemplates.stream().filter(t -> t.getId().equals(templateId)).findFirst();

        if (selectedTemplateOptional.isPresent()) {
            Template selectedTemplate = selectedTemplateOptional.get();
            sessionTimeline.setMilestones(selectedTemplate.getMilestones());
            sessionTimeline.setIncrements(selectedTemplate.getIncrements());
            sessionTimeline.setIterative(selectedTemplate.getIncrements() != null);
            // sessionTimeline
        }
    
    }

}