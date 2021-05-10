package online.dipa.hub.services;

import online.dipa.hub.api.model.FormField;
import online.dipa.hub.api.model.Project;
import online.dipa.hub.api.model.ProjectRole;
import online.dipa.hub.api.model.ProjectTask;

import online.dipa.hub.api.model.Result;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.model.User;
import online.dipa.hub.persistence.entities.*;
import online.dipa.hub.persistence.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

import java.util.*;
import java.util.stream.Collectors;


@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectTaskTemplateRepository projectTaskTemplateRepository;

    @Autowired
    private ProjectTaskRepository projectTaskRepository;

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
        List<Long> projectIds = userInformationService.getProjectIdList();
        var projectEntity = timelineService.getProject(projectId);

        if (projectIds.contains(projectId)) {
            projectEntity.setAkz(project.getAkz());
            projectEntity.setName(project.getName());
            projectEntity.setProjectSize(project.getProjectSize().toString());
            projectEntity.setClient(project.getClient());
            projectEntity.setDepartment(project.getDepartment());
          
            projectRepository.save(projectEntity);

        }
    }

    public Timeline createProject(final Project project) {

        var newProject = new ProjectEntity(project);
        newProject.setProjectApproach(projectApproachService.getProjectApproachFromRepo(project.getProjectApproachId()));

        UserEntity projectOwner = userRepository.findAll().stream().filter(u -> u.getId().equals(project.getProjectOwner().getId())).findFirst().orElse(null);
        newProject.setUser(projectOwner);
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

        userInformationService.createNewProjectRoles(newProject);
        return conversionService.convert(newProject, Timeline.class);
    }

    public List<ProjectTask> getProjectTasks (final Long projectId, final boolean isPermanentTask) {
        List<ProjectTask> projectTasks = new ArrayList<>();
        List<Long> projectIds = userInformationService.getProjectIdList();

        if (projectIds.contains(projectId)) {

            ProjectEntity project = timelineService.getProject(projectId);

            initializeProjectTasks(projectId);

            ProjectTaskTemplateEntity template = project.getProjectTaskTemplate();
            if (project.getProjectSize() != null && !project.getProjectSize()
                        .equals(Project.ProjectSizeEnum.BIG.toString())) {

                projectTasks.addAll(template.getProjectTasks()
                                            .stream()
                                            .map(p -> conversionService.convert(p, ProjectTask.class))
                                            .filter(Objects::nonNull)
                                            .filter(task -> !isPermanentTask || task.getIsPermanentTask()
                                                                                    .equals(true))
                                            .sorted(Comparator.comparing(ProjectTask::getSortOrder))
                                            .collect(Collectors.toList()));
            }
        }
        return projectTasks;
    }

    private void initializeProjectTasks(final Long projectId) {
        ProjectEntity project = timelineService.getProject(projectId);

        if (project.getProjectSize() != null && (project.getProjectSize().equals("SMALL") || project.getProjectSize().equals("MEDIUM"))
                && project.getProjectTaskTemplate() == null) {
            ProjectTaskTemplateEntity projectTaskTemplate = projectTaskTemplateRepository.findAll().stream().filter(
                    ProjectTaskTemplateEntity::getMaster).findFirst().orElse(null);

            ProjectTaskTemplateEntity projectTaskProject = new ProjectTaskTemplateEntity("Project Task Template" + project.getName(), false, project);
            projectTaskTemplateRepository.save(projectTaskProject);

            for (ProjectTaskEntity projectTask: Objects.requireNonNull(projectTaskTemplate)
                                                       .getProjectTasks()) {
                ProjectTaskEntity newProjectTask = new ProjectTaskEntity(projectTask);
                newProjectTask.setProjectTaskTemplate(projectTaskProject);
                projectTaskRepository.save(newProjectTask);

                for (FormFieldEntity entry: projectTask.getEntries()) {
                    FormFieldEntity newFormField = new FormFieldEntity(entry);
                    newFormField.setProjectTask(newProjectTask);

                    formFieldRepository.save(newFormField);
                }

                createNewResults(projectTask, newProjectTask);
            }
            project.setProjectTaskTemplate(projectTaskTemplate);
        }
    }

    private void createNewResults(ProjectTaskEntity oldProjectTask, ProjectTaskEntity newProjectTask) {
        for (ResultEntity result: oldProjectTask.getResults()) {

            ResultEntity newResultEntity = new ResultEntity();
            newResultEntity.setResultType(result.getResultType());
            newResultEntity.setProjectTask(newProjectTask);
            resultRepository.save(newResultEntity);

            for (FormFieldEntity formFieldResult: result.getFormFields()) {
                FormFieldEntity newFormFieldResult = new FormFieldEntity(formFieldResult);
                newFormFieldResult.setResultEntity(newResultEntity);
                formFieldRepository.save(newFormFieldResult);

                if (formFieldResult.getOptions() != null) {

                    Set<OptionEntryEntity> options = formFieldResult.getOptions()
                                                                    .stream().map(o -> conversionService.convert(o, OptionEntryEntity.class))
                                                                    .collect(Collectors.toSet());

                    options.forEach(opt -> {
                        OptionEntryEntity newOptionEntry = new OptionEntryEntity(opt);
                        newOptionEntry.setFormField(newFormFieldResult);
                        optionEntryRepository.save(newOptionEntry);
                    });
                }
            }
        }
    }

    public void updateProjectTask (final Long projectId, final ProjectTask projectTask) {

        List<Long> projectIds = userInformationService.getProjectIdList();

        if (projectIds.contains(projectId)) {

            ProjectEntity project = timelineService.getProject(projectId);
            ProjectTaskTemplateEntity template = project.getProjectTaskTemplate();

            template.getProjectTasks().stream()
                    .filter(t -> t.getId().equals(projectTask.getId()))
                    .findFirst()
                    .ifPresent(oldProjectTask -> {
                        List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldProjectTask.getEntries());
                        List<FormField> newList = projectTask.getEntries().stream().map(FormField.class::cast).collect(Collectors.toList());

                        for (int i = 0; i < newList.size(); i++) {

                            if (i > oldEntriesList.size() - 1) {

                                FormFieldEntity entity = new FormFieldEntity(newList.get(i));
                                entity.setProjectTask(oldProjectTask);

                                if (newList.get(i).getOptions() != null) {

                                    Set<OptionEntryEntity> options = newList.get(i).getOptions()
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

                                oldEntriesList.get(i).setValue(newList.get(i).getValue());
                                oldEntriesList.get(i).setShow(newList.get(i).getShow());

                            }
                        }
                        updateResults(oldProjectTask, projectTask);
                    });
                }

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
                }
            }
            else {
                List<FormFieldEntity> oldEntriesList = new ArrayList<>(findResultEntity(oldList, newResult.getId()).getFormFields());
                List<FormField> newListEntries = newResult.getFormFields();


                for (FormField formField: newListEntries) {
                    findFormFieldEntity(oldEntriesList, formField.getId()).setValue(formField.getValue());
                    findFormFieldEntity(oldEntriesList, formField.getId()).setShow(formField.getShow());
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

    public List<ProjectRole> getProjectRoles (final Long projectId) {
        ProjectEntity project = timelineService.getProject(projectId);

        return project.getProjectRoleTemplate().getProjectRoles().stream().map(r -> conversionService.convert(r, ProjectRole.class))
        .collect(Collectors.toList());

    }
    
    public List<User> getProjectUsers (final Long projectId) {
        ProjectEntity project = timelineService.getProject(projectId);
        

        return userRepository.findAll().stream().filter(u -> u.getProjectRoles().stream()
                                                              .anyMatch(role ->role.getProjectRoleTemplate().getProject().equals(project)))
        .map(user -> conversionService.convert(user, User.class)).collect(Collectors.toList());
        
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
