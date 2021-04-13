package online.dipa.hub.services;

import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;

import org.apache.commons.collections4.ListUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import online.dipa.hub.api.model.*;
import online.dipa.hub.persistence.entities.IncrementEntity;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.repositories.MilestoneTemplateRepository;
import online.dipa.hub.persistence.repositories.PlanTemplateRepository;
import static java.time.temporal.ChronoUnit.HOURS;

@Service
@Transactional
public class MilestoneService {

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    @Autowired
    private MilestoneTemplateRepository milestoneTemplateRepository;
    
    @Autowired
    private ConversionService conversionService;

    @Autowired
    private TimelineService timelineService;


    public List<Milestone> getMilestonesForTimeline(final Long timelineId) {

        ProjectEntity project = timelineService.getProject(timelineId);


        return project.getPlanTemplate()
                      .getMilestones().stream().map(p -> conversionService.convert(p, Milestone.class)).collect(Collectors.toList());
    }

    public void getIncrementMilestones(final Long timelineId, final int addedIncrementCount) {

        Map<IncrementEntity, List<MilestoneTemplateEntity>> hashmapIncrementMilestones = mapMilestonesIncrement(timelineId, addedIncrementCount);
    
        for (Map.Entry<IncrementEntity, List<MilestoneTemplateEntity>> entry : hashmapIncrementMilestones.entrySet()) {
            
            OffsetDateTime firstDatePeriod = Objects.requireNonNull(entry.getValue()
                                                                         .stream()
                                                                         .min(Comparator.comparing(
                                                                                 MilestoneTemplateEntity::getDate))
                                                                         .orElse(null))
                                                    .getDate();
            OffsetDateTime lastDatePeriod = Objects.requireNonNull(entry.getValue()
                                                                        .stream()
                                                                        .max(Comparator.comparing(
                                                                                MilestoneTemplateEntity::getDate))
                                                                        .orElse(null))
                                                   .getDate();
            
            long oldHoursBetween = HOURS.between(firstDatePeriod, lastDatePeriod);
            long newHoursBetween = HOURS.between(entry.getKey().getStartDate().plusDays(14), entry.getKey().getEndDate());
            OffsetDateTime newStartDateIncrement = entry.getKey().getStartDate().plusDays(14);

            double factor = (double) newHoursBetween / oldHoursBetween;

            for (MilestoneTemplateEntity m : entry.getValue()) {

                long hoursFromFirstDate = HOURS.between(firstDatePeriod, newStartDateIncrement);
                OffsetDateTime newDateBeforeScale = m.getDate().plusHours(hoursFromFirstDate);

                long relativePositionBeforeScale = HOURS.between(newStartDateIncrement, newDateBeforeScale);
                long newDateAfterScale = (long)(relativePositionBeforeScale * factor);

                m.setDate(newStartDateIncrement.plusHours(newDateAfterScale));

            }
        }

        if (addedIncrementCount > 0) {
            createMilestonesNewIncrement(timelineId);
        }
 
    }

    Map<IncrementEntity, List<MilestoneTemplateEntity>> mapMilestonesIncrement(Long timelineId, final int addedIncrementCount) {

        ProjectEntity currentProject = timelineService.getProject(timelineId);
        List<IncrementEntity> incrementsList = new ArrayList<>(new ArrayList<>(currentProject.getIncrements()));

        if (addedIncrementCount > 0) {
            incrementsList.remove(incrementsList.size() - 1);
        }

        List<MilestoneTemplateEntity> milestonesFromRepo = getMilestonesFromRepository(currentProject.getProjectApproach().getId());
        int milestoneEachIncrementCount = milestonesFromRepo.size() - 2;

        List<MilestoneTemplateEntity> currentMilestones = currentProject.getPlanTemplate()
                                                                        .getMilestones()
                                                                        .stream()
                                                                        .sorted(Comparator.comparing(
                                                                                MilestoneTemplateEntity::getDate))
                                                                        .collect(Collectors.toList());
        currentMilestones.removeIf(MilestoneTemplateEntity::getIsMaster);

        List<List<MilestoneTemplateEntity>> incrementsMilestonesList = ListUtils.partition(currentMilestones, milestoneEachIncrementCount);

        //remove milestones from last increment
        if (addedIncrementCount < 0) {
            List<MilestoneTemplateEntity> toDeleteMilestones = incrementsMilestonesList.get(incrementsMilestonesList.size() - 1);
            milestoneTemplateRepository.deleteInBatch(toDeleteMilestones);
        }

        return IntStream.range(0, incrementsList.size())
                        .boxed()
                        .collect(Collectors.toMap(incrementsList::get, incrementsMilestonesList::get));
    }

    private void createMilestonesNewIncrement (final Long timelineId) {
        ProjectEntity currentProject = timelineService.getProject(timelineId);
        PlanTemplateEntity planTemplate = currentProject.getPlanTemplate();

        IncrementEntity newIncrement = new ArrayList<>(currentProject.getIncrements()).get(currentProject.getIncrements().size() - 1);

        List<MilestoneTemplateEntity> milestonesFromRepo = new ArrayList<>(getMilestonesFromRepository(currentProject.getProjectApproach().getId()));

        milestonesFromRepo.removeIf(MilestoneTemplateEntity::getIsMaster);
        milestonesFromRepo.forEach(m -> m.setDate(OffsetDateTime.now().plusDays(m.getDateOffset())));

        OffsetDateTime initTimelineStart = Objects.requireNonNull(milestonesFromRepo.stream()
                                                                                    .min(Comparator.comparing(
                                                                                            MilestoneTemplateEntity::getDate))
                                                                                    .orElse(null))
                                                  .getDate();

        OffsetDateTime initTimelineEnd = Objects.requireNonNull(milestonesFromRepo.stream()
                                                                                  .max(Comparator.comparing(
                                                                                          MilestoneTemplateEntity::getDate))
                                                                                  .orElse(null))
                                                .getDate();

        long oldHoursBetweenTemplate = HOURS.between(initTimelineStart, initTimelineEnd);
        long newHoursBetweenTemplate = HOURS.between(newIncrement.getStartDate().plusDays(14), newIncrement.getEndDate());

        OffsetDateTime newStartDateNewIncrement = newIncrement.getStartDate().plusDays(14);

        double factor = (double) newHoursBetweenTemplate / oldHoursBetweenTemplate;

        for (MilestoneTemplateEntity m : milestonesFromRepo) {

            long hoursFromFirstDate = HOURS.between(initTimelineStart, newStartDateNewIncrement);
            OffsetDateTime newDateBeforeScale = m.getDate().plusHours(hoursFromFirstDate);

            long relativePositionBeforeScale = HOURS.between(newStartDateNewIncrement, newDateBeforeScale);
            long newDateAfterScale = (long)(relativePositionBeforeScale * factor);

            MilestoneTemplateEntity newMilestone = new MilestoneTemplateEntity(m);

            newMilestone.setPlanTemplate(planTemplate);
            newMilestone.setDate(newStartDateNewIncrement.plusHours(newDateAfterScale));

            milestoneTemplateRepository.save(newMilestone);

        }
    }

    List<MilestoneTemplateEntity> getMilestonesFromRepository(final Long projectApproachId) {

        final ProjectApproachEntity projectApproach = timelineService.findProjectApproach(projectApproachId);

        List<MilestoneTemplateEntity> milestones = new ArrayList<>();

        if (projectApproach != null) {

            Optional<PlanTemplateEntity> planTemplate = planTemplateRepository.findAll().stream()
                    .filter(template -> template.getProjectApproaches() != null)
                    .filter(template -> timelineService.filterProjectApproach(template, projectApproach.getId()))
                    .filter(PlanTemplateEntity::getDefaultTemplate)
                    .findFirst();

            planTemplate.ifPresent(template -> milestones.addAll(getMilestonesFromTemplate(template)));

        }

        return sortMilestones(milestones);
    }

    List<MilestoneTemplateEntity> getMilestonesFromTemplate(PlanTemplateEntity planTemplate) {
        return planTemplate.getMilestones().stream()
                .sorted(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).collect(Collectors.toList());
    }

    List<MilestoneTemplateEntity> sortMilestones(List<MilestoneTemplateEntity> milestones) {
         return milestones.stream()
            .sorted(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).collect(Collectors.toList());
    }

    List<MilestoneTemplateEntity> sortMilestonesDate(List<MilestoneTemplateEntity> milestones) {
         return milestones.stream()
        .sorted(Comparator.comparing(MilestoneTemplateEntity::getDate)).collect(Collectors.toList());
    }

    public void updateMilestoneStatus(final Long milestoneId, final Milestone.StatusEnum status) {

        milestoneTemplateRepository.findAll().stream().filter(m -> m.getId().equals(milestoneId)).findFirst()
            .ifPresent(milestone -> milestone.setStatus(status.toString()));
        
    }

}
