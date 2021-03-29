package online.dipa.hub.services;

import net.fortuna.ical4j.model.TimeZone;
import online.dipa.hub.IcsCalendar;
import online.dipa.hub.api.model.*;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.repositories.*;
import online.dipa.hub.session.model.SessionTimeline;
import online.dipa.hub.session.state.SessionTimelineState;

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
    private PlanTemplateRepository planTemplateRepository;

    @Autowired
    private MilestoneTemplateRepository milestoneTemplateRepository;

    @Autowired
    private FileRepository fileRepository;

    // @Autowired
    // private IncrementService incrementService;

    @Autowired
    private MilestoneService milestoneService;

    @Autowired
    private ProjectApproachService projectApproachService;

    @Autowired
    private UserInformationService userInformationService;

    protected static final long FIRST_MASTER_MILESTONE_ID = 21;
    boolean check = false; 

    public List<Timeline> getTimelines() {

        List<Long> projectIds = userInformationService.getUserData().getProjects();
       
        return projectRespository.findAll().stream().map(p -> conversionService.convert(p, Timeline.class))
                .filter(t -> projectIds.contains(t.getId())).collect(Collectors.toList());
    }

    public Timeline getTimeline(final Long timelineId) {
             
        return projectRespository.findAll().stream().map(p -> conversionService.convert(p, Timeline.class))
                .filter(t -> t.getId().equals(timelineId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Timeline with id: %1$s not found.", timelineId)));

    }

    public ProjectEntity getProject(final Long timelineId) {
             
        return projectRespository.findAll().stream()
                .filter(t -> t.getId().equals(timelineId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Project with id: %1$s not found.", timelineId)));

    }

    public PlanTemplateEntity getPlanTemplate(final ProjectEntity project) {
             
        return project.getPlanTemplate();

    }

    public void initializeTimelines() {
        Map<Long, SessionTimeline> listTimelines = new HashMap<>();

        // projectRespository.findAll().stream().map(p -> conversionService.convert(p, Timeline.class))
        //         .forEach(t -> {
        //             SessionTimeline sessionTimeline = sessionTimelineState.findTimelineState(t.getId());

        //             if (sessionTimeline.getTimeline() == null) {
        //                 sessionTimeline.setTimeline(t);
        //             }
        //             listTimelines.put(t.getId(), sessionTimeline);
        //         });

        // sessionTimelineState.setSessionTimelines(listTimelines);
        // projectRespository.findAll().stream()
        //     .forEach(project -> {
        //         // System.out.println(project.getPlanTemplate());
        //         // if (project.getPlanTemplate() == null) {
        //             // System.out.println(project.getProjectApproach().getPlanTemplate()
        //             //     .stream().filter(t -> t.getDefaultTemplate() == true).findFirst().get());
        //             System.out.println(project.getName());
        //             project.getProjectApproach().getPlanTemplate()
        //                 .stream().filter(t -> t.getDefaultTemplate() == true)
        //                 .findFirst().ifPresent(template -> {

        //                     System.out.println(template.getName());

                            
        //                     // System.out.println(planTemplate.getMilestones());
        //                     PlanTemplateEntity newPlanTemplateEntity = new PlanTemplateEntity();

        //                     newPlanTemplateEntity.setId(planTemplateRepository.count() + 1);
        //                     newPlanTemplateEntity.setName(template.getName() + project.getId());
        //                     // newPlanTemplateEntity.setOperationTypes(template.getOperationTypes());
        //                     // newPlanTemplateEntity.setProjectApproaches(template.getProjectApproaches());
        //                     newPlanTemplateEntity.setProject(project);
        //                     newPlanTemplateEntity.setStandard(template.getStandard());
        //                     // System.out.println(newPlanTemplateEntity.getId());
                            
        //                     // System.out.println(newPlanTemplateEntity.getId());

        //                     planTemplateRepository.save(newPlanTemplateEntity);
            
        //                     // System.out.println(planTemplateRepository.count());
        //                     // milestoneService.saveMilestones(newPlanTemplateEntity, project.getProjectApproach().getId());
        //                     // newPlanTemplateEntity.setMilestones(new HashSet<MilestoneTemplateEntity>(milestones));
        //                     // newPlanTemplateEntity.setTask(new HashSet<TaskTemplateEntity>(new ArrayList<>()));

                            
        //                     System.out.println(planTemplateRepository.count());


        //                     // project.setPlanTemplate(newPlanTemplateEntity);
        //                     // projectRespository.save(project);
        //                     // System.out.println(projectRespository.findAll().stream()
        //                     // .filter(p -> p.getId().equals(project.getId())).findFirst().get().getPlanTemplate().getName());
        //                 });

        //         // }
                
                
        //     });
            check = true;
    }

    ProjectApproachEntity findProjectApproach(Long projectApproachId) {
        return projectRespository.findAll().stream()
        .filter(p -> p.getProjectApproach().getId().equals(projectApproachId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Project approach with id: %1$s not found.", projectApproachId))).getProjectApproach();
    }

    public void moveTimelineByDays(final Long timelineId, final Long days) {
        ProjectEntity project = getProject(timelineId);
        
        project.setStartDate(project.getStartDate().plusDays(days));
        project.setEndDate(project.getEndDate().plusDays(days));
    
        List<PlanTemplateEntity> approaches = planTemplateRepository.findAll().stream().collect(Collectors.toList());

        // for (PlanTemplateEntity app: approaches){
        //     System.out.println("id"+ app.getId());
        //     if (app.getProjectApproaches() != null) {
        //         System.out.println("planTemplate"+ app.getProjectApproaches().size());
        //     }
        //     // if( app.getProject()!=null){
        //     //     System.out.println(app.getProject());
        //     // }
        // }

        for (MilestoneTemplateEntity m : project.getPlanTemplate().getMilestones()) {
            m.setDate(m.getDate().plusDays(days));
        }
    }

    public void moveTimelineStartByDays(final Long timelineId, final Long days) {

        ProjectEntity project = getProject(timelineId);
        
        OffsetDateTime timelineStart = project.getStartDate();
        OffsetDateTime timelineEnd = project.getEndDate();

        long oldDaysBetween = HOURS.between(timelineStart, timelineEnd);
        long newDaysBetween = oldDaysBetween - (days * 24);
        double factor = (double) newDaysBetween / oldDaysBetween;
        
        OffsetDateTime newTimelineStart = timelineStart.plusDays(days);
        project.setStartDate(project.getStartDate().plusDays(days));


        for (MilestoneTemplateEntity m : getPlanTemplate(project).getMilestones()) {
            long oldMilestoneRelativePosition = HOURS.between(timelineStart, m.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            m.setDate(newTimelineStart.plusHours(newMilestoneRelativePosition));


        }
        // for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
        //     long oldMilestoneRelativePosition = HOURS.between(timelineStart, temp.getDate());
        //     long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

        //     temp.setDate(newTimelineStart.plusHours(newMilestoneRelativePosition));

        //     temp.setDate(newTimelineStart.plusDays(newMilestoneRelativePosition));

        // }

        // incrementService.updateIncrements(timelineId);

    }

    public void moveTimelineEndByDays(final Long timelineId, final Long days) {

        ProjectEntity project = getProject(timelineId);
        
        OffsetDateTime timelineStart = project.getStartDate();
        OffsetDateTime timelineEnd = project.getEndDate();

        long oldDaysBetween = HOURS.between(timelineStart, timelineEnd);
        long newDaysBetween = oldDaysBetween + (days * 24);
        double factor = (double) newDaysBetween / oldDaysBetween;
        
        OffsetDateTime newTimelineEnd = timelineEnd.plusDays(days);
        project.setEndDate(newTimelineEnd);

        for (MilestoneTemplateEntity m : getPlanTemplate(project).getMilestones()) {
            long oldMilestoneRelativePosition = HOURS.between(timelineStart, m.getDate());
            long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

            m.setDate(timelineStart.plusHours(newMilestoneRelativePosition));

        }
        // for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
        //     long oldMilestoneRelativePosition = HOURS.between(timelineStart, temp.getDate());
        //     long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

        //     temp.setDate(newTimelineStart.plusHours(newMilestoneRelativePosition));

        //     temp.setDate(newTimelineStart.plusDays(newMilestoneRelativePosition));

        // }

        // incrementService.updateIncrements(timelineId);

    }

    public void moveMileStoneByDays(final Long timelineId, final Long days, final Long movedMilestoneId) {

        ProjectEntity project = getProject(timelineId);
        PlanTemplateEntity planTemplateEntity = getPlanTemplate(project);

        Optional<OffsetDateTime> oldFirstMilestoneOptionalDate = planTemplateEntity.getMilestones().stream()
        .map(MilestoneTemplateEntity::getDate).min(OffsetDateTime::compareTo);

        if (oldFirstMilestoneOptionalDate.isPresent()) {

            OffsetDateTime oldProjectStart = project.getStartDate();

            for (MilestoneTemplateEntity m : planTemplateEntity.getMilestones()) {
                if (m.getId().equals(movedMilestoneId)) {
                    m.setDate(m.getDate().plusHours(days * 24));
                }
            }

            Optional<OffsetDateTime> newFirstMilestoneOptionalDate = planTemplateEntity.getMilestones().stream()
            .map(MilestoneTemplateEntity::getDate).min(OffsetDateTime::compareTo);

            if (newFirstMilestoneOptionalDate.isPresent()) {
                OffsetDateTime newFirstMilestoneDate = newFirstMilestoneOptionalDate.get();

                long daysOffsetStart = Duration.between(oldProjectStart, newFirstMilestoneDate).toHours();

                if (newFirstMilestoneDate.isBefore(oldProjectStart) || newFirstMilestoneDate.isEqual(oldProjectStart)) {
                    OffsetDateTime newProjectStart = oldProjectStart.plusHours(daysOffsetStart - 24);

                    project.setStartDate(newProjectStart);
                }
                
            }

            Optional<OffsetDateTime> newLastMilestoneOptionalDate = planTemplateEntity.getMilestones().stream()
                .map(MilestoneTemplateEntity::getDate).max(OffsetDateTime::compareTo);

            if (newLastMilestoneOptionalDate.isPresent()) {
                OffsetDateTime newLastMilestoneDate = newLastMilestoneOptionalDate.get();

                OffsetDateTime oldProjectEnd = project.getEndDate();

                long daysOffsetEnd = Duration.between(oldProjectEnd, newLastMilestoneDate).toHours();
                OffsetDateTime newProjectEnd = project.getEndDate().plusHours(daysOffsetEnd);

                project.setEndDate(newProjectEnd);
            }
        }
    }


    // public void moveTimelineByDays(final Long timelineId, final Long days) {

    //     SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);

    //     milestoneService.updateTempMilestones(timelineId);

    //     LocalDate newTimelineStart = sessionTimeline.getTimeline().getStart().plusDays(days);
    //     LocalDate newTimelineEnd = sessionTimeline.getTimeline().getEnd().plusDays(days);

    //     sessionTimeline.getTimeline().setStart(newTimelineStart);
    //     sessionTimeline.getTimeline().setEnd(newTimelineEnd);

    //     for (Milestone m : sessionTimeline.getMilestones()) {
    //         m.setDate(m.getDate().plusDays(days));
    //     }

    //     for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
    //         temp.setDate(temp.getDate().plusDays(days));
    //     }

    //     // incrementService.updateIncrements(timelineId);

    // }

    // public void moveTimelineStartByDays(final Long timelineId, final Long days) {

    //     SessionTimeline sessionTimeline = sessionTimelineState.getSessionTimelines().get(timelineId);

    //     OffsetDateTime timelineStart = 
    //     OffsetDateTime.of(sessionTimeline.getTimeline().getStart(), LocalTime.NOON, ZoneOffset.UTC);

    //     OffsetDateTime timelineEnd = 
    //     OffsetDateTime.of(sessionTimeline.getTimeline().getEnd(), LocalTime.NOON, ZoneOffset.UTC);

    //     long oldDaysBetween = HOURS.between(timelineStart, timelineEnd);
    //     long newDaysBetween = oldDaysBetween - (days * 24);
    //     double factor = (double) newDaysBetween / oldDaysBetween;

    //     OffsetDateTime newTimelineStart = timelineStart.plusDays(days);
    //     sessionTimeline.getTimeline().setStart(newTimelineStart.toLocalDate());

    //     for (Milestone m : sessionTimeline.getMilestones()) {
    //         long oldMilestoneRelativePosition = HOURS.between(timelineStart, m.getDate());
    //         long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

    //         m.setDate(newTimelineStart.plusHours(newMilestoneRelativePosition));

    // //         m.setDate(newTimelineStart.plusDays(newMilestoneRelativePosition));

    //     for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
    //         long oldMilestoneRelativePosition = HOURS.between(timelineStart, temp.getDate());
    //         long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

    //         temp.setDate(newTimelineStart.plusHours(newMilestoneRelativePosition));

    //         temp.setDate(newTimelineStart.plusDays(newMilestoneRelativePosition));

    //     }

    //     incrementService.updateIncrements(timelineId);

    // }

    // public void moveTimelineEndByDays(final Long timelineId, final Long days) {

        // milestoneService.updateTempMilestones(timelineId);
        
        // OffsetDateTime timelineStart = 
        // OffsetDateTime.of(sessionTimeline.getTimeline().getStart(), LocalTime.NOON, ZoneOffset.UTC);

        // OffsetDateTime timelineEnd = 
        // OffsetDateTime.of(sessionTimeline.getTimeline().getEnd(), LocalTime.NOON, ZoneOffset.UTC);

        // long oldDaysBetween = HOURS.between(timelineStart, timelineEnd);
        // long newDaysBetween = oldDaysBetween + (days * 24);
        // double factor = (double) newDaysBetween / oldDaysBetween;

        // OffsetDateTime newTimelineEnd = timelineEnd.plusDays(days);
        // sessionTimeline.getTimeline().setEnd(newTimelineEnd.toLocalDate());
        
        // for (Milestone m : sessionTimeline.getMilestones()) {
        //     long oldMilestoneRelativePosition = HOURS.between(timelineStart, m.getDate());
        //     long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

        //     m.setDate(timelineStart.plusHours(newMilestoneRelativePosition));

        // }

        // for (Milestone temp : sessionTimeline.getTempIncrementMilestones()) {
        //     long oldMilestoneRelativePosition = HOURS.between(timelineStart, temp.getDate());
        //     long newMilestoneRelativePosition = Math.round(oldMilestoneRelativePosition * factor);

        //     temp.setDate(timelineStart.plusHours(newMilestoneRelativePosition));
        // }

    //         temp.setDate(timelineStart.plusDays(newMilestoneRelativePosition));
    //     }

    //     incrementService.updateIncrements(timelineId);

    // }

        // Optional<OffsetDateTime> oldFirstMilestoneOptionalDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
        //         .min(OffsetDateTime::compareTo);
        // if (oldFirstMilestoneOptionalDate.isPresent()) {

        //     LocalDate oldProjectStart = sessionTimeline.getTimeline().getStart();

    //         LocalDate oldProjectStart = sessionTimeline.getTimeline().getStart();
    //         long diffProjectStartMilestone = Duration
    //                 .between(oldFirstMilestoneDate.atStartOfDay(), oldProjectStart.atStartOfDay()).toDays();

            // Optional<OffsetDateTime> newFirstMilestoneOptionalDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
            //         .min(OffsetDateTime::compareTo);
            // if (newFirstMilestoneOptionalDate.isPresent()) {
            //     LocalDate newFirstMilestoneDate = newFirstMilestoneOptionalDate.get().toLocalDate();

            //     long daysOffsetStart = Duration.between(oldProjectStart.atStartOfDay(), newFirstMilestoneDate.atStartOfDay())
            //             .toDays();

            //     if (newFirstMilestoneDate.isBefore(oldProjectStart) || newFirstMilestoneDate.isEqual(oldProjectStart)) {
            //         LocalDate newProjectStart = oldProjectStart.plusDays(daysOffsetStart - 1);

            //         sessionTimeline.getTimeline().setStart(newProjectStart);
            //     }
                
            // }

            // Optional<OffsetDateTime> newLastMilestoneOptionalDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
            //         .max(OffsetDateTime::compareTo);

            // if (newLastMilestoneOptionalDate.isPresent()) {
            //     LocalDate newLastMilestoneDate = newLastMilestoneOptionalDate.get().toLocalDate();

    //         Optional<LocalDate> newLastMilestoneOptionalDate = sessionTimeline.getMilestones().stream().map(Milestone::getDate)
    //                 .max(LocalDate::compareTo);
    //         if (newLastMilestoneOptionalDate.isPresent()) {
    //             LocalDate newLastMilestoneDate = newLastMilestoneOptionalDate.get();

    //             LocalDate oldProjectEnd = sessionTimeline.getTimeline().getEnd();

    //             long daysOffsetEnd = Duration.between(oldProjectEnd.atStartOfDay(), newLastMilestoneDate.atStartOfDay())
    //                     .toDays();
    //             LocalDate newProjectEnd = sessionTimeline.getTimeline().getEnd().plusDays(daysOffsetEnd);

    //             sessionTimeline.getTimeline().setEnd(newProjectEnd);
    //         }
    //     }
    // }

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
        ProjectEntity project = getProject(timeline.getId());

        if (!timeline.getProjectApproachId().equals(project.getProjectApproach().getId())) {
            project.setProjectApproach(projectApproachService.getProjectApproachFromRepo(timeline.getProjectApproachId()));
            project.setProjectType(timeline.getProjectType().toString());

            PlanTemplateEntity planTemplate = projectApproachService.getDefaultPlanTemplateEntityFromRepo(timeline.getProjectApproachId()); 
            List<MilestoneTemplateEntity> newMilestones = planTemplate.getMilestones().stream().collect(Collectors.toList());
            
            PlanTemplateEntity projectPlanTemplate = project.getPlanTemplate();

            for (MilestoneTemplateEntity oldM: projectPlanTemplate.getMilestones()) {
                System.out.println(oldM);
                milestoneTemplateRepository.delete(oldM);
            }

            // projectPlanTemplate.getMilestones().stream().forEach(m -> milestoneTemplateRepository.deleteById(m.getId()));
            System.out.println(projectPlanTemplate.getMilestones().size());

            for (MilestoneTemplateEntity milestone: newMilestones) {
                MilestoneTemplateEntity newMilestone = new MilestoneTemplateEntity(milestone);
                
                newMilestone.setPlanTemplate(projectPlanTemplate);
                System.out.println(milestone.getId());
                System.out.println(milestone.getPlanTemplate());
                
                

                System.out.println(newMilestone.getId());
                System.out.println(newMilestone.getPlanTemplate());
                System.out.println(newMilestone.getDate());
                System.out.println(newMilestone.getName());


                milestoneTemplateRepository.save(newMilestone);
            }

            projectRespository.save(project);
        }


        
        // projectRespository.findAll().stream()
        //     .filter(t -> t.getId().equals(timeline.getId())).findFirst()
        //     .ifPresent(projectEntity -> {

        //         projectEntity.setProjectApproach(projectApproachService.getProjectApproachFromRepo(timeline.getProjectApproachId()));
        //         projectEntity.setProjectType(timeline.getProjectType().toString());
        //         projectRespository.save(projectEntity);

        //     });

        // ProjectApproachEntity projectApproach = projectApproachService.getProjectApproachFromRepo(timeline.getProjectApproachId());
        // projectApproach.getPlanTemplate().

        // sessionTimeline.getTimeline().setProjectType(timeline.getProjectType());
        // sessionTimeline.getTimeline().setOperationTypeId(timeline.getOperationTypeId());
        // sessionTimeline.getTimeline().setProjectApproachId(timeline.getProjectApproachId());

        // sessionTimeline.setMilestones(null);
        // sessionTimeline.setIncrements(null);
        // sessionTimeline.setTempIncrementMilestones(null);

        // sessionTimelineState.getSessionTimelineTemplates().remove(timeline.getId());

        // milestoneService.initializeMilestones(timeline.getId());
        // milestoneService.updateMilestonesAndIncrement(timeline);
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

    PlanTemplateEntity getPlanTemplateFromRepo(final Long planTemplateId) {
        
        return planTemplateRepository.findAll().stream().filter(p -> p.getId().equals(planTemplateId))
            .findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Plan Template with id: %1$s not found.", planTemplateId)));
    }

}
