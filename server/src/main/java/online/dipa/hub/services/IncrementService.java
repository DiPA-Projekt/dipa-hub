package online.dipa.hub.services;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import online.dipa.hub.api.model.*;

import online.dipa.hub.persistence.entities.IncrementEntity;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.repositories.IncrementRepository;

import static java.time.temporal.ChronoUnit.HOURS;

@Service
@Transactional
public class IncrementService {

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private IncrementRepository incrementRepository;

    @Autowired
    private MilestoneService milestoneService;

    @Autowired
    private TimelineService timelineService;


    public List<Increment> getIncrementsForTimeline(final Long timelineId) {
        ProjectEntity currentProject = timelineService.getProject(timelineId);

        initializeIncrements(timelineId);

        List<Increment> result = currentProject.getIncrements().stream()
                .map(i -> conversionService.convert(i, Increment.class))
                .collect(Collectors.toList());

        return Objects.requireNonNullElse(result, Collections.emptyList());
    }

    void initializeIncrements(final Long timelineId) {

        ProjectEntity currentProject = timelineService.getProject(timelineId);
       
        List<IncrementEntity> currentIncrementsList = new ArrayList<>(currentProject.getIncrements());

        if (currentIncrementsList.isEmpty() && currentProject.getProjectApproach().isIterative() && currentProject.getPlanTemplate().getStandard()) {

            currentProject.setIncrements(this.loadIncrementsTemplate(timelineId, 1));

        }
    }

    public void addIncrement(Long timelineId) {

        ProjectEntity currentProject = timelineService.getProject(timelineId);

        int incrementCount = currentProject.getIncrements().size();

        currentProject.setIncrements(loadIncrementsTemplate(timelineId, incrementCount + 1));
        milestoneService.getIncrementMilestones(timelineId, 1);
    }

    public void deleteIncrement(Long timelineId) {
        ProjectEntity currentProject = timelineService.getProject(timelineId);
        int incrementCount = currentProject.getIncrements().size();

        if (incrementCount != 1) {
                currentProject.setIncrements(loadIncrementsTemplate(timelineId, incrementCount - 1));
                milestoneService.getIncrementMilestones(timelineId, - 1);
        }
    }

    public void updateDurationIncrements(final Long timelineId) {
        ProjectEntity currentProject = timelineService.getProject(timelineId);

        int incrementCount = currentProject.getIncrements().size();

        currentProject.setIncrements(loadIncrementsTemplate(currentProject.getId(), incrementCount));
        milestoneService.getIncrementMilestones(currentProject.getId(), 0);
    }

    /**
     * returns list of increments
     * @param timelineId
     * @param incrementCount
     * @return
     */
    private Set<IncrementEntity> loadIncrementsTemplate(final Long timelineId, final int incrementCount) {
        
        ProjectEntity currentProject = timelineService.getProject(timelineId);

        Set<IncrementEntity> newIncrementsList = new HashSet<>();
        List<IncrementEntity> currentIncrementsList = new ArrayList<>(currentProject.getIncrements());

        List<MilestoneTemplateEntity> currentMilestones = new ArrayList<>(currentProject.getPlanTemplate()
                                                                                     .getMilestones());
        currentMilestones = milestoneService.sortMilestonesDate(currentMilestones);

        OffsetDateTime firstMilestoneDate = currentMilestones.get(1).getDate().minusDays(14);
        OffsetDateTime lastMilestoneDate = currentMilestones.get(currentMilestones.size() - 2).getDate();

        long hoursBetween = HOURS.between(firstMilestoneDate, lastMilestoneDate);

        long durationIncrement = hoursBetween / incrementCount;

        long id = incrementCount;

        OffsetDateTime startDateIncrement = firstMilestoneDate;
        OffsetDateTime endDateIncrement = startDateIncrement.plusHours(durationIncrement);

        if (incrementCount < currentIncrementsList.size()) {

            newIncrementsList.addAll(deleteLastIncrement(currentIncrementsList,incrementCount, firstMilestoneDate, lastMilestoneDate, durationIncrement));

        }
        else {
            for (int i = 0; i < incrementCount; i++) {

                if (i > currentIncrementsList.size() - 1) {
                    IncrementEntity newIncrement = new IncrementEntity("Inkrement " + id, startDateIncrement, endDateIncrement, currentProject);
                    incrementRepository.save(newIncrement);
                    newIncrementsList.add(newIncrement);
                }
                else {
                   IncrementEntity increment = currentIncrementsList.get(i);
                   increment.setStartDate(startDateIncrement);
                   increment.setEndDate(endDateIncrement);
                   newIncrementsList.add(increment);

                }

                startDateIncrement = endDateIncrement.plusDays(1);

                if (i == (incrementCount - 2)) {
                    endDateIncrement = lastMilestoneDate;
                } else {
                    endDateIncrement = endDateIncrement.plusHours(durationIncrement);
                }
            }
        }
        return newIncrementsList;
    }

    private List<IncrementEntity> deleteLastIncrement (List<IncrementEntity> currentIncrementsList, int incrementCount,
            OffsetDateTime firstMilestoneDate, OffsetDateTime lastMilestoneDate, Long durationIncrement) {

        OffsetDateTime startDateIncrement = firstMilestoneDate;
        OffsetDateTime endDateIncrement = startDateIncrement.plusHours(durationIncrement);

        IncrementEntity lastIncrement = currentIncrementsList.get(currentIncrementsList.size() - 1);
        incrementRepository.delete(lastIncrement);
        currentIncrementsList.remove(lastIncrement);

        for (int i = 0; i < incrementCount; i++) {
            IncrementEntity increment = currentIncrementsList.get(i);
            increment.setStartDate(startDateIncrement);
            increment.setEndDate(endDateIncrement);

            startDateIncrement = endDateIncrement.plusDays(1);

            if (i == (incrementCount - 2)) {
                endDateIncrement = lastMilestoneDate;
            } else {
                endDateIncrement = endDateIncrement.plusHours(durationIncrement);
            }
        }
        return currentIncrementsList;

    }

    public Set<IncrementEntity> createIncrementsTimelineTemplate(final int incrementCount,
            List<MilestoneTemplateEntity> milestones) {
                
        Set<IncrementEntity> newIncrementsList = new HashSet<>();

        milestones = milestoneService.sortMilestonesDate(milestones);
        
        OffsetDateTime firstMilestoneDate = milestones.get(1).getDate().minusDays(14);
        OffsetDateTime lastMilestoneDate = milestones.get(milestones.size() - 2).getDate();

        long hoursBetween = HOURS.between(firstMilestoneDate, lastMilestoneDate);

        long durationIncrement = hoursBetween / incrementCount;

        long id = 1;

        OffsetDateTime startDateIncrement = firstMilestoneDate;
        OffsetDateTime endDateIncrement = startDateIncrement.plusHours(durationIncrement);
        
        for (int i = 0; i < incrementCount; i++) {
                IncrementEntity increment = new IncrementEntity("Inkrement " + id, startDateIncrement, endDateIncrement, null);
        
                newIncrementsList.add(increment);          
        }

        return newIncrementsList;
    }
}
