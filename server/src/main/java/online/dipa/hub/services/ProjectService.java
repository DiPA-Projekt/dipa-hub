package online.dipa.hub.services;

import online.dipa.hub.api.model.FormField;
import online.dipa.hub.api.model.Project;
import online.dipa.hub.api.model.ProjectTask;

import online.dipa.hub.api.model.Result;
import online.dipa.hub.mapper.ProjectProjectEntityMapper;
import online.dipa.hub.mapper.ProjectTaskProjectTaskEntityMapper;
import online.dipa.hub.persistence.entities.*;
import online.dipa.hub.persistence.repositories.*;

import org.mapstruct.factory.Mappers;
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
    private ProjectRepository projectRespository;

    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    @Autowired
    private FormFieldRepository formFieldRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ConversionService conversionService;

    private final ProjectProjectEntityMapper projectMapper = Mappers.getMapper(ProjectProjectEntityMapper.class);
    private final ProjectTaskProjectTaskEntityMapper projectTaskMapper = Mappers.getMapper(ProjectTaskProjectTaskEntityMapper.class);


    public Project getProjectData(final Long projectId) {

        return projectRespository.findAll().stream().map(p -> conversionService.convert(p, Project.class))
        .filter(t -> t.getId().equals(projectId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Project with id: %1$s not found.", projectId)));
                
    }
    
    public void updateProjectData(final Long projectId, final Project project) {

        projectRespository.findAll().stream()
            .filter(t -> t.getId().equals(projectId)).findFirst()
            .ifPresent(projectEntity -> 
                projectMapper.updateProjectEntity(project, projectEntity)
            );

    }

    public List<ProjectTask> getProjectTasks (final Long projectId) {

        List<ProjectTask> projectTasks = new ArrayList<>();

        projectRespository.findAll().stream().filter(t -> t.getId().equals(projectId))
        .findFirst().ifPresent(project -> {

            Optional<ProjectTaskTemplateEntity> template = project.getProjectTaskTemplates().stream().findFirst();

            if (template.isPresent() && !project.getProjectSize().equals(Project.ProjectSizeEnum.BIG.toString())) {

                projectTasks.addAll(template.get().getProjectTasks()
                .stream().map(p -> conversionService.convert(p, ProjectTask.class))
                .sorted(Comparator.comparing(ProjectTask::getId))
                .collect(Collectors.toList()));
            }

        });

        return projectTasks;
        
    }

    public void updateProjectTask (final Long projectId, final ProjectTask projectTask) {

        Optional<ProjectEntity> project = projectRespository.findAll().stream()
            .filter(t -> t.getId().equals(projectId)).findFirst();

        ProjectTaskEntity oldProjectTaskEntity = projectTaskRepository.findAll().stream()
                                                                      .filter(t -> t.getId().equals(projectTask.getId())).findFirst().orElse(null);
        project.flatMap(projectEntity -> projectEntity.getProjectTaskTemplates().stream().findFirst())
                .flatMap(template -> template.getProjectTasks().stream()
                    .filter(t -> t.getId().equals(projectTask.getId()))
                    .findFirst()
                )
                .ifPresent(oldProjectTask -> {
                    // projectTaskMapper.updateFormFieldEntity(projectTask, oldProjectTask, formFieldRepository);
                    List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldProjectTask.getEntries());
                    List<FormField> newList = projectTask.getEntries().stream().map(FormField.class::cast).collect(Collectors.toList());

                    for (int i = 0; i < newList.size(); i++) {

                        if (i > oldEntriesList.size() - 1) {

                            FormFieldEntity entity = new FormFieldEntity(newList.get(i));
                            entity.setProjectTask(oldProjectTask);
//                            entity.setOptions(conversionService.convert(newList.get(i).getOptions().stream(), OptionEntryEntity.class));

                            formFieldRepository.save(entity);
                        }
                        else {

                            oldEntriesList.get(i).setValue(newList.get(i).getValue());

                        }
                    }
                            updateResults(oldProjectTask, projectTask);

                });
    }

    private void updateResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask) {

        List<ResultEntity> oldList = new ArrayList<>(projectTaskEntity.getResults());
        List<Result> newList = projectTask.getResults().stream().map(Result.class::cast).collect(Collectors.toList());

        ResultEntity entity = oldList.get(0);
        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {

                ResultEntity newResultEntity = new ResultEntity();
                newResultEntity.setResultType(entity.getResultType()); // "TYPE_ELBE_SC"
                newResultEntity.setProjectTask(projectTaskEntity);
                resultRepository.save(newResultEntity);

                List<FormField> newListEntries = newList.get(i).getFormFields();


                for (FormField newListEntry : newListEntries) {
                    FormFieldEntity formField = new FormFieldEntity(newListEntry);

                    formField.setId(formFieldRepository.count() + 1);
                    formField.setResultEntity(newResultEntity);

                    formFieldRepository.save(formField);
                }
            } else {
                List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldList.get(i).getFormFields());
                List<FormField> newListEntries = newList.get(i).getFormFields();

                for (int j = 0; j < newListEntries.size(); j++) {
                    oldEntriesList.get(j).setValue(newListEntries.get(j).getValue());

                }
            }

        }
    }
    
}
