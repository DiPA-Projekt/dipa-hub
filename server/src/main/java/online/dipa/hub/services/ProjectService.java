package online.dipa.hub.services;

import net.fortuna.ical4j.model.DateList;
import net.fortuna.ical4j.model.DateTime;
import net.fortuna.ical4j.model.parameter.Value;
import net.fortuna.ical4j.model.property.RRule;
import online.dipa.hub.api.model.FinalProjectTask;
import online.dipa.hub.api.model.ProjectEvent;
import online.dipa.hub.api.model.ProjectEventTemplate;
import online.dipa.hub.api.model.FormField;
import online.dipa.hub.api.model.NonPermanentProjectTask;
import online.dipa.hub.api.model.PermanentProjectTask;
import online.dipa.hub.api.model.Project;
import online.dipa.hub.api.model.ProjectRole;
import online.dipa.hub.api.model.ProjectTask;

import online.dipa.hub.api.model.PropertyQuestion;
import online.dipa.hub.api.model.Result;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.model.User;
import online.dipa.hub.persistence.entities.*;
import online.dipa.hub.persistence.entities.FinalProjectTaskTemplateEntity;
import online.dipa.hub.persistence.repositories.*;
import online.dipa.hub.tenancy.CurrentTenantContextHolder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
@Transactional
public class ProjectService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectService.class);

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectTaskTemplateRepository projectTaskTemplateRepository;

    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    @Autowired
    private PermanentProjectTaskRepository permanentProjectTaskRepository;

    @Autowired
    private PermanentProjectTaskTemplateRepository permanentProjectTaskTempRep;

    @Autowired
    private NonPermanentProjectTaskRepository nonPermanentProjectTaskRepository;

    @Autowired
    private NonPermanentProjectTaskTemplateRepository nonPermanentProjectTaskTempRep;

    @Autowired
    private FinalProjectTaskRepository finalProjectTaskRepository;

    @Autowired
    private FinalProjectTaskTemplateRepository finalProjectTaskTempRepository;

    @Autowired
    private ProjectPropertyQuestionRepository projectPropertyQuestionRepository;

    @Autowired
    private ProjectPropertyQuestionTemplateRepository projectPropertyQuestionTemplateRepository;

    @Autowired
    private FormFieldRepository formFieldRepository;

    @Autowired
    private OptionEntryEntityRepository optionEntryRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private ProjectApproachService projectApproachService;

    @Autowired
    private TimelineTemplateService timelineTemplateService;

    @Autowired
    private UserInformationService userInformationService;

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    @Autowired
    private MilestoneTemplateRepository milestoneTemplateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventTemplateRepository eventTemplateRepository;

    @Autowired
    private RecurringEventTypeRepository recurringEventTypeRepository;

    @Autowired
    private RecurringEventPatternRepository recurringEventPatternRepository;

    private static final String ITZBUND_TENANT = "itzbund";
    private static final String PROJECT_SIZE_SMALL = "SMALL";
    private static final String PROJECT_SIZE_MEDIUM = "MEDIUM";
    private static final String TYPE_RECURRING_EVENT = "TYPE_RECURRING_EVENT";
    private static final String TYPE_APPT_SERIES = "TYPE_APPT_SERIES";

    public Project getProjectData(final Long projectId) {
        List<Long> projectIds = userInformationService.getProjectIdList();

        return projectRepository.findAll()
                                .stream()
                                .map(p -> conversionService.convert(p, Project.class))
                                .filter(Objects::nonNull)
                                .filter(t -> projectIds.contains(t.getId()))
                                .filter(t -> t.getId().equals(projectId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Project with id: %1$s not found.", projectId)));
    }

    public void updateProjectData(final Long projectId, final Project project) {
        var projectEntity = projectRepository.getById(projectId);

        projectEntity.setAkz(project.getAkz());
        projectEntity.setName(project.getName());
        projectEntity.setProjectSize(project.getProjectSize().toString());
        projectEntity.setClient(project.getClient());
        projectEntity.setDepartment(project.getDepartment());
        projectEntity.setArchived(project.getArchived());
        projectEntity.setDescription(project.getDescription());

        projectRepository.save(projectEntity);

    }

    public Timeline createProject(final Project project, final User projectOwner) {

        var newProject = new ProjectEntity(project);
        newProject.setProjectApproach(projectApproachService.getProjectApproachFromRepo(project.getProjectApproachId()));

        projectRepository.save(newProject);

        var planTemplate = projectApproachService.getDefaultPlanTemplateEntityFromRepo(project.getProjectApproachId());
        List<MilestoneTemplateEntity> repoMilestones = new ArrayList<>(planTemplate.getMilestones());

        var projectPlanTemplate = new PlanTemplateEntity();
        projectPlanTemplate.setProject(newProject);
        projectPlanTemplate.setName(planTemplate.getName() + newProject.getId());
        projectPlanTemplate.setDefaultTemplate(true);
        projectPlanTemplate.setStandard(true);

        planTemplateRepository.save(projectPlanTemplate);

        List<MilestoneTemplateEntity> newMilestones = new ArrayList<>();

        for (MilestoneTemplateEntity milestone: repoMilestones) {
            var newMilestone = new MilestoneTemplateEntity(milestone);

            newMilestone.setPlanTemplate(projectPlanTemplate);

            newMilestones.add(newMilestone);
        }

        newMilestones = timelineTemplateService.updateMilestonesTimelineTemplate(newProject.getId(), newMilestones, planTemplate);
        milestoneTemplateRepository.saveAll(newMilestones);
        userInformationService.createNewProjectRoles(newProject, projectOwner);
        initializeProjectTasks(newProject.getId());

        createRecurringEventTypes(newProject);
        return conversionService.convert(newProject, Timeline.class);
    }

    public void deleteProject(final Long projectId) {
        var projectEntity = projectRepository.getById(projectId);

        projectRepository.delete(projectEntity);
    }

    public List<PropertyQuestion> getProjectPropertyQuestions (final Long projectId) {
        List<PropertyQuestion> propertyQuestions = new ArrayList<>();

        ProjectEntity project = timelineService.getProject(projectId);
        ProjectPropertyQuestionTemplateEntity template = project.getProjectPropertyQuestionTemplate();

        if(template != null) {
            propertyQuestions.addAll(template.getProjectPropertyQuestions()
                                             .stream()
                                             .map(p -> conversionService.convert(p, PropertyQuestion.class))
                                             .collect(Collectors.toList())
            );
        }

        return propertyQuestions;
    }

    public void updateProjectPropertyQuestion(final PropertyQuestion propertyQuestion) {
        projectPropertyQuestionRepository.findById(propertyQuestion.getId())
                                         .ifPresent(pQuestion -> {
                                             pQuestion.setSelected(propertyQuestion.getSelected());
                                             projectPropertyQuestionRepository.save(pQuestion);
                                             if (pQuestion.getRecurringEventTypes() != null) {
                                                 updateRecurringEventsBasedOnPQuestions(pQuestion);
                                             }
                                         });
    }

    public void updateRecurringEventsBasedOnPQuestions (final ProjectPropertyQuestionEntity pQuestion) {
        if (!pQuestion.getSelected()) {
            for (RecurringEventTypeEntity recurringEventType: pQuestion.getRecurringEventTypes()) {

                if (!eventTemplateRepository.findByRecurringEventType(recurringEventType).isEmpty()) {
                    ProjectEventTemplateEntity eventTemplate = new ArrayList<>(
                            eventTemplateRepository.findByRecurringEventType(recurringEventType)).get(0);

                    ProjectEntity project = eventTemplate.getProject();
                    project.getEventTemplates().remove(eventTemplate);
                    RecurringEventTypeEntity eventType = eventTemplate.getRecurringEventType();
                    eventType.setProjectEventTemplate(null);

                    eventTemplateRepository.delete(eventTemplate);
                }
            }
        }
        else {
            for (RecurringEventTypeEntity recurringEventType: pQuestion.getRecurringEventTypes()) {
                if (eventTemplateRepository.findByRecurringEventType(recurringEventType).isEmpty()) {
                    createEventTemplates(pQuestion.getProjectPropertyQuestionTemplate()
                                                  .getProject(), recurringEventType, null);
                }
            }
        }

    }

    public List<ProjectTask> getProjectTasks (final Long projectId) {
        List<ProjectTask> projectTasks = new ArrayList<>();
        ProjectEntity project = projectRepository.getById(projectId);

        initializeProjectTasks(projectId);

        ProjectTaskTemplateEntity template = project.getProjectTaskTemplate();
        if (project.getProjectSize() != null && !project.getProjectSize()
                                                        .equals(Project.ProjectSizeEnum.BIG.toString()) && template != null) {

            projectTasks.addAll(template.getProjectTasks()
                                        .stream()
                                        .map(p -> conversionService.convert(p, ProjectTask.class))
                                        .filter(Objects::nonNull)
                                        .filter(task -> task.getProjectPropertyQuestion() == null || task.getProjectPropertyQuestion().getSelected())
                                        .sorted(Comparator.comparing(ProjectTask::getSortOrder))
                                        .collect(Collectors.toList()));
        }
        return projectTasks;
    }

    public List<PermanentProjectTask> getPermanentProjectTasks (final Long projectId) {
        List<PermanentProjectTask> permanentProjectTasks = new ArrayList<>();

        ProjectEntity project = projectRepository.getById(projectId);

        initializeProjectTasks(projectId);

        PermanentProjectTaskTemplateEntity template = project.getPermanentProjectTaskTemplate();

        if (project.getProjectSize() != null && !project.getProjectSize()
                                                        .equals(Project.ProjectSizeEnum.BIG.toString()) && template != null) {

            permanentProjectTasks.addAll(template.getPermanentProjectTasks()
                                                 .stream()
                                                 .map(p -> conversionService.convert(p, PermanentProjectTask.class))
                                                 .filter(Objects::nonNull)
                                                 .filter(task -> task.getProjectTask().getProjectPropertyQuestion() == null ||
                                                         task.getProjectTask().getProjectPropertyQuestion().getSelected())
                                                 .sorted(Comparator.comparing(PermanentProjectTask::getSortOrder))
                                                 .collect(Collectors.toList()));
        }

        return permanentProjectTasks;
    }

    public List<NonPermanentProjectTask> getNonPermanentProjectTasks (final Long projectId) {
        List<NonPermanentProjectTask> nonPermanentProjectTasks = new ArrayList<>();

        ProjectEntity project = projectRepository.getById(projectId);

        initializeProjectTasks(projectId);

        NonPermanentProjectTaskTemplateEntity template = project.getNonPermanentProjectTaskTemplate();
        if (project.getProjectSize() != null && !project.getProjectSize()
                                                        .equals(Project.ProjectSizeEnum.BIG.toString())
                && template != null) {

            nonPermanentProjectTasks.addAll(template.getNonPermanentProjectTasks()
                                                    .stream()
                                                    .map(p -> conversionService.convert(p, NonPermanentProjectTask.class))
                                                    .filter(Objects::nonNull)
                                                    .filter(task -> task.getProjectTask().getProjectPropertyQuestion() == null ||
                                                            task.getProjectTask().getProjectPropertyQuestion().getSelected())
                                                    .sorted(Comparator.comparing(NonPermanentProjectTask::getSortOrder))
                                                    .collect(Collectors.toList()));
        }

        return nonPermanentProjectTasks;
    }


    public List<FinalProjectTask> getFinalProjectTasks (final Long projectId) {
        List<FinalProjectTask> finalProjectTasks = new ArrayList<>();
        ProjectEntity project = projectRepository.getById(projectId);

        initializeProjectTasks(projectId);

        FinalProjectTaskTemplateEntity template = project.getFinalProjectTaskTemplate();

        if (project.getProjectSize() != null && !project.getProjectSize()
                                                        .equals(Project.ProjectSizeEnum.BIG.toString()) && template != null) {

            finalProjectTasks.addAll(template.getFinalProjectTasks()
                                             .stream()
                                             .map(p -> conversionService.convert(p, FinalProjectTask.class))
                                             .filter(Objects::nonNull)
                                             .filter(task -> task.getProjectTask().getProjectPropertyQuestion() == null ||
                                                     task.getProjectTask().getProjectPropertyQuestion().getSelected())
                                             .collect(Collectors.toList()));
        }

        return finalProjectTasks;
    }

    public void updatePermanentProjectTasks(List<PermanentProjectTask> permanentProjectTasks) {

        for (PermanentProjectTask permanentProjectTask: permanentProjectTasks) {
            PermanentProjectTaskEntity permanentProjectTaskEntity = permanentProjectTaskRepository
                    .getById(permanentProjectTask.getId());
            permanentProjectTaskEntity.setSortOrder(permanentProjectTask.getSortOrder());
        }
    }

    public void updateNonPermanentProjectTasks(List<NonPermanentProjectTask> nonPermanentProjectTasks) {

        for (NonPermanentProjectTask nonPermanentProjectTask: nonPermanentProjectTasks) {
            NonPermanentProjectTaskEntity nonPermanentProjectTaskEntity = nonPermanentProjectTaskRepository
                    .getById(nonPermanentProjectTask.getId());
            nonPermanentProjectTaskEntity.setSortOrder(nonPermanentProjectTask.getSortOrder());
        }
    }

    public void updateFinalProjectTasks(List<FinalProjectTask> finalProjectTasks) {

        for (FinalProjectTask finalProjectTask: finalProjectTasks) {
            FinalProjectTaskEntity finalProjectTaskEntity = finalProjectTaskRepository
                    .getById(finalProjectTask.getId());
            finalProjectTaskEntity.setSortOrder(finalProjectTask.getSortOrder());
        }
    }

    public void initializeProjectTasks(final Long projectId) {
        ProjectEntity project = projectRepository.getById(projectId);
        final String tenantId = CurrentTenantContextHolder.getTenantId();

        if (tenantId.equals(ITZBUND_TENANT) && project.getProjectSize() != null &&
                (project.getProjectSize().equals(PROJECT_SIZE_SMALL) || project.getProjectSize().equals(PROJECT_SIZE_MEDIUM))
                && project.getProjectTaskTemplate() == null) {
            ProjectTaskTemplateEntity projectTaskTemplate = projectTaskTemplateRepository.findByMaster().orElse(null);

            ProjectTaskTemplateEntity projectTaskProject = new
                    ProjectTaskTemplateEntity("Project Task Template " + project.getName(), false, project);
            projectTaskTemplateRepository.save(projectTaskProject);

            PermanentProjectTaskTemplateEntity permanentProjectTaskTemp = new
                    PermanentProjectTaskTemplateEntity("Permanent Project Task Template " + project.getName(), false, project);

            NonPermanentProjectTaskTemplateEntity nonPermanentProjectTaskTemp = new
                    NonPermanentProjectTaskTemplateEntity("Non Permanent Project Task Template " + project.getName(), false, project);

            FinalProjectTaskTemplateEntity finalProjectTaskTemp = new FinalProjectTaskTemplateEntity
                    ("Final Project Task Template " + project.getName(), false, project);

            ProjectPropertyQuestionTemplateEntity propertyQuestionTemplate = createNewPropertyQuestions(project);

            for (ProjectTaskEntity projectTask: Objects.requireNonNull(projectTaskTemplate)
                                                       .getProjectTasks()) {
                ProjectTaskEntity newProjectTask = new ProjectTaskEntity(projectTask);
                newProjectTask.setProjectTaskTemplate(projectTaskProject);

                if (projectTask.getProjectPropertyQuestion() != null) {
                    projectPropertyQuestionRepository
                            .findByTemplateAndSortOrder(propertyQuestionTemplate, projectTask.getProjectPropertyQuestion().getSortOrder())
                            .ifPresent(newProjectTask::setProjectPropertyQuestion);
                }
                projectTaskRepository.save(newProjectTask);

                projectTaskProject.getProjectTasks().add(newProjectTask);

                for (FormFieldEntity entry: projectTask.getEntries()) {
                    FormFieldEntity newFormField = new FormFieldEntity(entry);
                    newFormField.setProjectTask(newProjectTask);
                    newProjectTask.getEntries().add(newFormField);
                    formFieldRepository.save(newFormField);
                }

                createPermanentProjectTasks(projectTask, newProjectTask, permanentProjectTaskTemp,
                        nonPermanentProjectTaskTemp, finalProjectTaskTemp);
                permanentProjectTaskTempRep.save(permanentProjectTaskTemp);
                nonPermanentProjectTaskTempRep.save(nonPermanentProjectTaskTemp);
                finalProjectTaskTempRepository.save(finalProjectTaskTemp);

                createNewResults(projectTask, newProjectTask);
                projectTaskRepository.save(newProjectTask);

            }

            project.setProjectTaskTemplate(projectTaskProject);
            project.setPermanentProjectTaskTemplate(permanentProjectTaskTemp);
            project.setNonPermanentProjectTaskTemplate(nonPermanentProjectTaskTemp);
            project.setFinalProjectTaskTemplate(finalProjectTaskTemp);
            project.setProjectPropertyQuestionTemplate(propertyQuestionTemplate);

            projectRepository.save(project);
        }
    }

    /**
     * create permanent, non-permanent and final project tasks
     * @param projectTaskTemp
     * @param newProjectTask
     * @param permanentProjectTaskTemp
     * @param nonPermanentProjectTaskTemp
     * @param finalProjectTaskTemp
     */
    public void createPermanentProjectTasks (ProjectTaskEntity projectTaskTemp, ProjectTaskEntity newProjectTask,
            PermanentProjectTaskTemplateEntity permanentProjectTaskTemp, NonPermanentProjectTaskTemplateEntity nonPermanentProjectTaskTemp,
            FinalProjectTaskTemplateEntity finalProjectTaskTemp) {

        if (projectTaskTemp.getPermanentProjectTask() != null) {
            PermanentProjectTaskEntity newPermanentProjectTask = new PermanentProjectTaskEntity(projectTaskTemp.getPermanentProjectTask());
            newPermanentProjectTask.setPermanentProjectTaskTemplate(permanentProjectTaskTemp);
            newPermanentProjectTask.setProjectTask(newProjectTask);
            permanentProjectTaskTemp.getPermanentProjectTasks().add(newPermanentProjectTask);

        }

        if (projectTaskTemp.getNonPermanentProjectTask() != null) {
            NonPermanentProjectTaskEntity newNonPermanentProjectTask = new NonPermanentProjectTaskEntity(projectTaskTemp.getNonPermanentProjectTask());
            newNonPermanentProjectTask.setNonPermanentProjectTaskTemplate(nonPermanentProjectTaskTemp);
            newNonPermanentProjectTask.setProjectTask(newProjectTask);
            nonPermanentProjectTaskTemp.getNonPermanentProjectTasks().add(newNonPermanentProjectTask);

        }

        if (projectTaskTemp.getFinalProjectTask() != null) {
            FinalProjectTaskEntity newFinalProjectTask = new FinalProjectTaskEntity(projectTaskTemp.getFinalProjectTask());
            newFinalProjectTask.setFinalProjectTaskTemplate(finalProjectTaskTemp);
            newFinalProjectTask.setProjectTask(newProjectTask);
            finalProjectTaskTemp.getFinalProjectTasks().add(newFinalProjectTask);

        }
    }

    public ProjectPropertyQuestionTemplateEntity createNewPropertyQuestions(ProjectEntity project) {

        ProjectPropertyQuestionTemplateEntity propertyQuestionTemplate = new ProjectPropertyQuestionTemplateEntity
                ("Property Question Template " + project.getName(), false, project);
        projectPropertyQuestionTemplateRepository.save(propertyQuestionTemplate);

        projectPropertyQuestionTemplateRepository.findByMaster().ifPresent(temp -> {
            for (ProjectPropertyQuestionEntity projectPropertyQuestion: temp.getProjectPropertyQuestions()) {

                ProjectPropertyQuestionEntity newPropertyQuestion = new ProjectPropertyQuestionEntity(projectPropertyQuestion);
                newPropertyQuestion.setProjectPropertyQuestionTemplate(propertyQuestionTemplate);
                propertyQuestionTemplate.getProjectPropertyQuestions().add(newPropertyQuestion);
                projectPropertyQuestionRepository.save(newPropertyQuestion);

            }
        });

        return propertyQuestionTemplate;
    }

    /**
     * create new results for new project task
     * @param oldProjectTask
     * @param newProjectTask
     */
    private void createNewResults(ProjectTaskEntity oldProjectTask, ProjectTaskEntity newProjectTask) {
        for (ResultEntity result: oldProjectTask.getResults()) {

            ResultEntity newResultEntity = new ResultEntity();
            newResultEntity.setResultType(result.getResultType());
            newResultEntity.setProjectTask(newProjectTask);
            newProjectTask.getResults().add(newResultEntity);
            resultRepository.save(newResultEntity);

            for (FormFieldEntity formFieldResult: result.getFormFields()) {
                FormFieldEntity newFormFieldResult = new FormFieldEntity(formFieldResult);
                newFormFieldResult.setResultEntity(newResultEntity);
                newResultEntity.getFormFields().add(newFormFieldResult);
                formFieldRepository.save(newFormFieldResult);

                if (formFieldResult.getOptions() != null) {

                    Set<OptionEntryEntity> options = formFieldResult.getOptions()
                                                                    .stream().map(o -> conversionService.convert(o, OptionEntryEntity.class))
                                                                    .collect(Collectors.toSet());

                    options.forEach(opt -> {
                        OptionEntryEntity newOptionEntry = new OptionEntryEntity(opt);
                        newOptionEntry.setFormField(newFormFieldResult);
                        newFormFieldResult.getOptions().add(newOptionEntry);
                        optionEntryRepository.save(newOptionEntry);
                    });
                }
            }
        }
    }

    public void updateProjectTask (final Long projectId, final ProjectTask projectTask) {

        ProjectEntity project = projectRepository.getById(projectId);
        ProjectTaskTemplateEntity template = project.getProjectTaskTemplate();

        template.getProjectTasks().stream()
                .filter(t -> t.getId().equals(projectTask.getId()))
                .findFirst()
                .ifPresent(oldProjectTask -> {
                    List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldProjectTask.getEntries());
                    List<FormField> newList = projectTask.getEntries().stream().map(FormField.class::cast).collect(Collectors.toList());

                    for (FormField formField: newList) {

                        if (formField.getId() == null) {

                            FormFieldEntity entity = new FormFieldEntity(formField);
                            entity.setProjectTask(oldProjectTask);

                            if (entity.getOptions() != null) {

                                Set<OptionEntryEntity> options = formField.getOptions()
                                                                          .stream().map(o -> conversionService.convert(o, OptionEntryEntity.class))
                                                                          .collect(Collectors.toSet());

                                options.forEach(opt -> {
                                    opt.setFormField(entity);
                                    optionEntryRepository.save(opt);
                                });
                            }
                            formFieldRepository.save(entity);
                        }
                        else {
                            findFormFieldEntity(oldEntriesList, formField.getId()).setValue(formField.getValue());
                            findFormFieldEntity(oldEntriesList, formField.getId()).setShow(formField.getShow());

                        }
                    }
                    updateResults(oldProjectTask, projectTask);

                    oldProjectTask.setCompleted(projectTask.getCompleted());
                    projectTaskRepository.save(oldProjectTask);
                });


    }

    private void updateResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask) {

        List<ResultEntity> oldList = new ArrayList<>(projectTaskEntity.getResults());
        List<Result> newList = projectTask.getResults().stream().map(Result.class::cast).collect(Collectors.toList());

        ResultEntity entity = oldList.get(0);

        List<Long> allNewResultsId = newList.stream().map(Result::getId).collect(Collectors.toList());
        List<Long> allResultIds = oldList.stream().map(BaseEntity::getId).collect(Collectors.toList());

        allResultIds.removeAll(allNewResultsId);
        allResultIds.remove(null);

        for (Result newResult: newList) {

            if (newResult.getId() == null) {
                ResultEntity newResultEntity = new ResultEntity();
                newResultEntity.setResultType(entity.getResultType()); // "TYPE_ELBE_SC"
                newResultEntity.setProjectTask(projectTaskEntity);
                resultRepository.save(newResultEntity);

                List<FormField> newListEntries = newResult.getFormFields();

                for (FormField newListEntry : newListEntries) {
                    FormFieldEntity formField = new FormFieldEntity(newListEntry);

                    formField.setResultEntity(newResultEntity);
                    formFieldRepository.save(formField);

                    if (newListEntry.getOptions() != null) {

                        Set<OptionEntryEntity> options = newListEntry.getOptions()
                                                                     .stream().map(o -> conversionService.convert(o, OptionEntryEntity.class))
                                                                     .collect(Collectors.toSet());

                        options.forEach(opt -> {
                            opt.setFormField(formField);
                            optionEntryRepository.save(opt);
                        });
                    }
                    newResultEntity.getFormFields().add(formField);

                }
                if (newResultEntity.getResultType().equals(TYPE_APPT_SERIES)) {
                    createSerieAppointments(newResultEntity);
                }
            }
            else {
                List<FormFieldEntity> oldEntriesList = new ArrayList<>(findResultEntity(oldList, newResult.getId()).getFormFields());
                List<FormField> newListEntries = newResult.getFormFields();
                ResultEntity resultEntity = findResultEntity(oldList, newResult.getId());

                for (FormField formField: newListEntries) {
                    FormFieldEntity formFieldEntity = findFormFieldEntity(oldEntriesList, formField.getId());

                    if (resultEntity.getResultType().equals(TYPE_APPT_SERIES) &&
                            formFieldEntity.getValue() != null && !formFieldEntity.getValue().equals(formField.getValue())
                            && resultEntity.getRecurringEventPattern() != null) {
                        formFieldEntity.setValue(formField.getValue());
                        updateSerieAppointments(resultEntity);

                    }

                    formFieldEntity.setValue(formField.getValue());
                    formFieldEntity.setShow(formField.getShow());
                }

                if (resultEntity.getResultType().equals(TYPE_APPT_SERIES)
                        && resultEntity.getRecurringEventPattern() == null) {
                    createSerieAppointments(resultEntity);
                }
            }

            if (!allResultIds.isEmpty()) {
                for (Long deletedResultId: allResultIds) {
                    ResultEntity toDeleteResultEntity = findResultEntity(oldList, deletedResultId);
                    List<FormFieldEntity> formFields = new ArrayList<>(toDeleteResultEntity.getFormFields());

                    for (FormFieldEntity formField: formFields) {
                        optionEntryRepository.deleteAll(formField.getOptions());
                        formFieldRepository.delete(formField);
                    }
                    resultRepository.delete(findResultEntity(oldList, deletedResultId));
                }
            }
        }
    }

    /**
     * this method generates all recurring events at the first time called.
     * Serie appointments are created only when a new result of type TYPE_APPT_SERIES is added.
     * @param projectId
     * @return
     */
    public List<ProjectEventTemplate> getEvents (final Long projectId) {
        ProjectEntity project = projectRepository.getById(projectId);
        if (project.getEventTemplates() == null ||
                project.getEventTemplates().stream()
                       .noneMatch(e -> e.getEventType()
                                        .equals(TYPE_RECURRING_EVENT))) {
            initializeRecurringEvents(project);
        }

        return project.getEventTemplates()
                      .stream()
                      .filter(t -> !t.getProjectEvents().isEmpty())
                      .map(p -> conversionService.convert(p, ProjectEventTemplate.class))
                      .collect(Collectors.toList());

    }

    public void createRecurringEventTypes(final ProjectEntity project) {
        Set<RecurringEventTypeEntity> recurringEventTypes = new HashSet<>();

        for (RecurringEventTypeEntity recurringEventType: recurringEventTypeRepository.findByMaster()) {
            RecurringEventTypeEntity newRecurringEventType = new RecurringEventTypeEntity(recurringEventType);
            if (recurringEventType.getProjectPropertyQuestion() != null) {
                project.getProjectPropertyQuestionTemplate().getProjectPropertyQuestions().stream()
                       .filter(q -> q.getSortOrder() == recurringEventType.getProjectPropertyQuestion().getSortOrder()).findFirst().ifPresent(
                        p -> {p.getRecurringEventTypes()
                               .add(newRecurringEventType);
                            newRecurringEventType.setProjectPropertyQuestion(p);});

            }
            newRecurringEventType.setProject(project);
            recurringEventTypeRepository.save(newRecurringEventType);
            recurringEventTypes.add(newRecurringEventType);

            RecurringEventPatternEntity newPattern = new RecurringEventPatternEntity(recurringEventType.getRecurringEventPattern(), project);
            newPattern.setRecurringEventType(newRecurringEventType);
            recurringEventPatternRepository.save(newPattern);
            newRecurringEventType.setRecurringEventPattern(newPattern);
        }
        project.setRecurringEventTypes(recurringEventTypes);

    }

    public void initializeRecurringEvents(final ProjectEntity project) {
        Set<ProjectEventTemplateEntity> eventTemplates = new HashSet<>();
        for (RecurringEventTypeEntity recurringEventType: project.getRecurringEventTypes()) {
            if (recurringEventType.getProjectPropertyQuestion() == null || (recurringEventType.getProjectPropertyQuestion() != null
                    && recurringEventType.getProjectPropertyQuestion().getSelected())) {
                eventTemplates.add(createEventTemplates(project, recurringEventType, null));
            }

        }
        project.setEventTemplates(eventTemplates);
    }

    public ProjectEventTemplateEntity createEventTemplates (final ProjectEntity project, @Nullable final RecurringEventTypeEntity eventType,
            @Nullable final ResultEntity resultEntity) {
        ProjectEventTemplateEntity eventTemplate = null;

        if (eventType != null) {
            RecurringEventPatternEntity eventPattern = eventType.getRecurringEventPattern();

            eventTemplate = new ProjectEventTemplateEntity("Wiederkehrende Termine "+ eventType.getTitle(),
                    TYPE_RECURRING_EVENT, project, eventType, null);
            eventTemplateRepository.save(eventTemplate);
            String status = eventType.isMandatory() ? "OPEN" : null;
            eventTemplate = createEventsForEventTemplate(eventPattern, eventType.getTitle(), eventTemplate, status);
            eventType.setProjectEventTemplate(eventTemplate);
        }

        if (resultEntity != null) {
            RecurringEventPatternEntity eventPattern = resultEntity.getRecurringEventPattern();

            eventTemplate = new ProjectEventTemplateEntity("Serie Termine "+ eventPattern.getTitle(),
                    TYPE_APPT_SERIES, project, null, resultEntity);
            eventTemplateRepository.save(eventTemplate);
            eventTemplate = createEventsForEventTemplate(eventPattern, eventPattern.getTitle(), eventTemplate, null);
            resultEntity.setProjectEventTemplate(eventTemplate);
        }

        return eventTemplate;
    }

    public ProjectEventTemplateEntity createEventsForEventTemplate (final RecurringEventPatternEntity eventPattern,
            String eventTitle, ProjectEventTemplateEntity eventTemplate, String status) {
        RRule rrule = createRRule(eventPattern.getRulePattern());

        DateTime start = dateTimeConverter(eventPattern.getStartDate(), eventPattern);
        DateTime end = dateTimeConverter(eventPattern.getEndDate(), eventPattern);
        DateList recurDates = rrule.getRecur().getDates(start, end, Value.DATE_TIME);

        Set<ProjectEventEntity> events = new HashSet<>();
        for (Date recurDate: recurDates) {
            ProjectEventEntity event = new ProjectEventEntity(eventTitle,
                    recurDate.toInstant().atOffset(ZoneOffset.UTC), eventPattern.getDuration(), status, eventTemplate);
            eventRepository.save(event);
            events.add(event);
        }
        eventTemplate.setProjectEvents(events);
        return eventTemplate;
    }

    private DateTime dateTimeConverter (final LocalDate date, final RecurringEventPatternEntity eventPattern) {
        LocalDateTime dt = LocalDateTime.of(date, eventPattern.getStartTime());
        ZonedDateTime zdt = dt.atZone(ZoneId.systemDefault());
        Date output = Date.from(zdt.toInstant());
        return new DateTime(output);
    }

    public void updateRecurringEventsBasedOnEndDate (final ProjectEntity project, final OffsetDateTime newEndDate) {
        OffsetDateTime today = OffsetDateTime.now();

        if (newEndDate.isAfter(today)) {
            for (ProjectEventTemplateEntity template : project.getEventTemplates().stream()
                                                              .filter(t -> t.getEventType().equals(TYPE_RECURRING_EVENT)).collect(
                            Collectors.toList())) {
                List<ProjectEventEntity> events = template.getProjectEvents()
                                                          .stream()
                                                          .filter(e -> e.getDateTime()
                                                                        .isAfter(today))
                                                          .collect(Collectors.toList());
                template.getProjectEvents()
                        .removeAll(events);
                eventRepository.deleteAll(events);

                if (project.getStartDate()
                           .isAfter(today)) {
                    createNewEvents(template, project.getStartDate()
                                                     .toLocalDate(), template.getRecurringEventType()
                                                                             .getRecurringEventPattern()
                                                                             .getEndDate());
                } else {
                    createNewEvents(template, today.toLocalDate(), template.getRecurringEventType()
                                                                           .getRecurringEventPattern()
                                                                           .getEndDate());

                }
            }
        } else {
            for (ProjectEventTemplateEntity template : project.getEventTemplates()) {
                List<ProjectEventEntity> events = template.getProjectEvents()
                                                          .stream()
                                                          .filter(e -> e.getDateTime()
                                                                        .isAfter(newEndDate))
                                                          .collect(Collectors.toList());
                template.getProjectEvents()
                        .removeAll(events);
                eventRepository.deleteAll(events);

            }
        }
    }

    public void updateRecurringEventsBasedOnStartDate (final ProjectEntity project, final OffsetDateTime newStartDate) {
        OffsetDateTime today = OffsetDateTime.now();

        if (newStartDate != null) {
            if (newStartDate.isBefore(today) && project.getStartDate().isAfter(today)) {
                for (ProjectEventTemplateEntity template: project.getEventTemplates()) {

                    List<ProjectEventEntity> events = template.getProjectEvents().stream().filter(e -> e.getDateTime().isAfter(today))
                                                              .collect(Collectors.toList());
                    template.getProjectEvents().removeAll(events);
                    eventRepository.deleteAll(events);

                    createNewEvents(template, today.toLocalDate(), template.getRecurringEventType().getRecurringEventPattern().getEndDate());

                }
            }
            else {
                for (ProjectEventTemplateEntity template: project.getEventTemplates()) {
                    List<ProjectEventEntity> events = template.getProjectEvents().stream()
                                                              .filter(e ->  e.getDateTime().isBefore(newStartDate) && e.getDateTime().isAfter(today))
                                                              .collect(Collectors.toList());
                    template.getProjectEvents().removeAll(events);
                    eventRepository.deleteAll(events);
                }
            }
        }
    }

    private void createNewEvents (ProjectEventTemplateEntity template, LocalDate startDate, LocalDate endDate) {
        RecurringEventPatternEntity eventPattern = template.getRecurringEventType().getRecurringEventPattern();
        RRule rrule = createRRule(eventPattern.getRulePattern());

        DateTime start = dateTimeConverter(startDate, eventPattern);
        DateTime end = dateTimeConverter(endDate, eventPattern);
        DateList recurDates = rrule.getRecur().getDates(start, end, Value.DATE_TIME);

        Set<ProjectEventEntity> events = new HashSet<>();
        for (Date recurDate: recurDates) {
            String status = template.getRecurringEventType().isMandatory() ? "OPEN" : null;
            ProjectEventEntity event = new ProjectEventEntity(template.getRecurringEventType().getTitle(),
                    recurDate.toInstant().atOffset(ZoneOffset.UTC), eventPattern.getDuration(), status, template);
            eventRepository.save(event);
            events.add(event);
        }
        events.addAll(template.getProjectEvents());
        template.setProjectEvents(events);
    }

    private RRule createRRule (String rulePattern) {
        RRule rrule = new RRule();
        try {
            rrule.setValue(rulePattern);
        } catch (ParseException e) {
            LOGGER.debug("context", e);
        }
        return  rrule;
    }

    /**
     * create new project event template and new serie appointments
     * @param result
     */
    public void createSerieAppointments (ResultEntity result) {
        ProjectEntity project = result.getProjectTask().getProjectTaskTemplate()
                                      .getProject();
        RecurringEventPatternEntity recurringEventPattern = new RecurringEventPatternEntity();
        convertFormFieldsToRecurringPattern(result, recurringEventPattern);
        recurringEventPattern.setResult(result);
        recurringEventPatternRepository.save(recurringEventPattern);

        result.setRecurringEventPattern(recurringEventPattern);
        createEventTemplates(project, null, result);
    }

    /**
     * delete old serie appointments from project event template and create new ones
     * @param result
     */
    public void updateSerieAppointments(ResultEntity result) {
        RecurringEventPatternEntity recurringEventPattern = result.getRecurringEventPattern();
        convertFormFieldsToRecurringPattern(result, recurringEventPattern);

        List<ProjectEventEntity> events = new ArrayList<>(result.getProjectEventTemplate()
                                                                .getProjectEvents());
        result.getProjectEventTemplate().getProjectEvents().removeAll(events);
        eventRepository.deleteAll(events);
        result.setProjectEventTemplate(createEventsForEventTemplate(recurringEventPattern, recurringEventPattern.getTitle(),
                result.getProjectEventTemplate(), null));
    }

    /**
     * Event pattern is generated based on the result's fields.
     * @param result
     * @param recurringEventPattern
     */
    private void convertFormFieldsToRecurringPattern (ResultEntity result,
            RecurringEventPatternEntity recurringEventPattern) {
        recurringEventPattern.setTitle(filterFormFieldsFromResult(result, "serie"));
        recurringEventPattern.setRulePattern(filterFormFieldsFromResult(result, "appointment"));
        recurringEventPattern.setStartDate(LocalDate.parse(filterFormFieldsFromResult(result, "startDate")));
        recurringEventPattern.setEndDate(LocalDate.parse(filterFormFieldsFromResult(result, "endDate")));
        recurringEventPattern.setStartTime(LocalTime.parse(filterFormFieldsFromResult(result, "startTime")));
        recurringEventPattern.setDuration(Integer.valueOf(filterFormFieldsFromResult(result, "duration")));

    }

    private String filterFormFieldsFromResult (ResultEntity result, String key) {
        String value = null;
        Optional<FormFieldEntity> optionalFormField = result.getFormFields().stream().filter(f -> f.getKey().equals(key))
                                                            .findFirst();
        if (optionalFormField.isPresent()) {
            value = optionalFormField.get().getValue();
        }
        return value;

    }

    public void updateProjectEvent (final ProjectEvent projectEvent) {
        eventRepository.findById(projectEvent.getId()).ifPresent(e -> e.setStatus(projectEvent.getStatus().toString()));

    }

    public List<ProjectRole> getProjectRoles (final Long projectId) {
        ProjectEntity project = projectRepository.getById(projectId);

        return project.getProjectRoleTemplate().getProjectRoles().stream().map(r -> conversionService.convert(r, ProjectRole.class))
                      .collect(Collectors.toList());

    }

    public List<User> getProjectUsers (final Long projectId) {
        ProjectEntity project = projectRepository.getById(projectId);


        return userRepository.findByProject(project)
                             .stream().map(user -> conversionService.convert(user, User.class)).collect(Collectors.toList());

    }

    private ResultEntity findResultEntity (List<ResultEntity> results, Long id) {
        return results.stream().filter(r -> r.getId().equals(id)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                String.format("Result with id: %1$s not found.", id)));
    }

    private FormFieldEntity findFormFieldEntity (List<FormFieldEntity> formFields, Long id) {
        return formFields.stream().filter(f -> f.getId().equals(id)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                String.format("FormField with id: %1$s not found.", id)));
    }

}
