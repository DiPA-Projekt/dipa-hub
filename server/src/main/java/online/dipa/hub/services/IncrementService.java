package online.dipa.hub.services;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import online.dipa.hub.api.model.*;
import online.dipa.hub.session.model.*;
import online.dipa.hub.session.state.*;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.repositories.ProjectRepository;

import static java.time.temporal.ChronoUnit.DAYS;
import static java.time.temporal.ChronoUnit.HOURS;


@Service
@Transactional
public class IncrementService {

    @Autowired
    private SessionTimelineState sessionTimelineState;

    @Autowired
    private ProjectRepository projectRespository;

    @Autowired
    private MilestoneService milestoneService;

    public List<Increment> getIncrementsForTimeline(final Long timelineId) {

        initializeIncrements(timelineId);

        List<Increment> result = sessionTimelineState.getSessionTimelines().get(timelineId).getIncrements();

        return Objects.requireNonNullElse(result, Collections.emptyList());
    }

    void initializeIncrements(final Long timelineId) {
        SessionTimeline sessionTimeline = sessionTimelineState.findTimelineState(timelineId);
        List<TimelineTemplate> currentSessionTemplates = sessionTimelineState.getSessionTimelineTemplates().get(timelineId);

        if (sessionTimeline.getIncrements() == null) {
            final ProjectApproachEntity projectApproach = projectRespository.findAll().stream()
                                                                            .filter(p -> p.getProjectApproach().getId().equals(sessionTimeline.getTimeline().getProjectApproachId())).findFirst().orElseThrow(() -> new EntityNotFoundException(
                            String.format("No project approach available for timeline id: %1$s.", timelineId))).getProjectApproach();

            if (projectApproach.isIterative() && (currentSessionTemplates == null || sessionTimeline.getIterative())) {

                List<Milestone> initMilestones = milestoneService.getMilestonesFromRespository(timelineId);
                sessionTimeline.setIncrements(this.loadIncrementsTemplate(timelineId, 1, initMilestones, null));

            }

        }
    }

    public void addIncrement(Long timelineId) {
        SessionTimeline sessionTimeline = sessionTimelineState.findTimelineState(timelineId);

        int incrementCount = sessionTimeline.getIncrements().size();

        sessionTimeline.setIncrements(this.loadIncrementsTemplate(timelineId, incrementCount + 1, null, sessionTimeline.getMilestones()));
        sessionTimeline.setMilestones(milestoneService.loadMilestones(timelineId, incrementCount + 1));
    }

    public void deleteIncrement(Long timelineId) {
        SessionTimeline sessionTimeline = sessionTimelineState.findTimelineState(timelineId);

        int incrementCount = sessionTimeline.getIncrements().size();

        if (incrementCount != 1) {
            sessionTimeline.setIncrements(this.loadIncrementsTemplate(timelineId, incrementCount - 1, null, sessionTimeline.getMilestones()));
            sessionTimeline.setMilestones(milestoneService.loadMilestones(timelineId, incrementCount - 1));
        }
    }
    
    List<Increment> loadIncrementsTemplate(final Long timelineId, final int incrementCount,
            List<Milestone> initMilestones, List<Milestone> currentMilestones) {

        OffsetDateTime firstMilestoneDate;
        OffsetDateTime lastMilestoneDate;
        long hoursBetween;
        List<Increment> incrementsList = new ArrayList<>();

        if (currentMilestones == null) {
            initMilestones = milestoneService.sortMilestones(initMilestones);

            initMilestones.removeIf(m -> m.getId().equals(MilestoneService.FIRST_MASTER_MILESTONE_ID));
            initMilestones.removeIf(m -> m.getId().equals(MilestoneService.LAST_MASTER_MILESTONE_ID));

            //minus 14 days for "Inkrement geplant"
            firstMilestoneDate = initMilestones.stream().map(Milestone::getDate).min(OffsetDateTime::compareTo).orElseThrow(() -> new EntityNotFoundException(
                    String.format("No valid milestone date available for timeline id: %1$s.", timelineId))).minusHours(14 * 24);
            lastMilestoneDate = initMilestones.stream().map(Milestone::getDate).max(OffsetDateTime::compareTo).orElseThrow(() -> new EntityNotFoundException(
                    String.format("No valid milestone date available for timeline id: %1$s.", timelineId)));

        } else {

            currentMilestones = milestoneService.sortMilestones(currentMilestones);
            firstMilestoneDate = currentMilestones.get(1).getDate();


            long daysBetweenMasterMilestone = DAYS.between(currentMilestones.get(0).getDate(), currentMilestones.get(1).getDate());
            long hoursBetweenMasterMilestone = HOURS.between(currentMilestones.get(0).getDate(), currentMilestones.get(1).getDate());
            System.out.println(daysBetweenMasterMilestone);
            if (daysBetweenMasterMilestone < 15) {
                double factor = (double) hoursBetweenMasterMilestone / (24 * 14);
                long newMilestoneRelativePosition = Math.round(hoursBetweenMasterMilestone * factor);

                // firstMilestoneDate.minusHours(newMilestoneRelativePosition);
            }
            else {
                firstMilestoneDate = currentMilestones.get(1).getDate().minusHours(14 * 24);

            }
            // firstMilestoneDate = currentMilestones.get(1).getDate().minusDays(14);
            lastMilestoneDate = currentMilestones.get(currentMilestones.size() - 2).getDate();

        }
        // if (DAYS.between(firstMilestoneDate)
        hoursBetween = HOURS.between(firstMilestoneDate, lastMilestoneDate);

        long durationIncrement = hoursBetween / incrementCount;

        long id = 1;

        OffsetDateTime startDateIncrement = firstMilestoneDate;
        OffsetDateTime endDateIncrement = startDateIncrement.plusHours(durationIncrement);
    
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
                endDateIncrement = endDateIncrement.plusHours(durationIncrement);
            }
        }
        return incrementsList;
    }

    void updateIncrements(final Long timelineId) {

        SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);

        List<Increment> increments = sessionTimeline.getIncrements();

        if (increments != null) {
            int incrementCount = increments.size();
            sessionTimeline.setIncrements(this.loadIncrementsTemplate(timelineId, incrementCount, null, sessionTimeline.getMilestones()));

        }
    }
}
