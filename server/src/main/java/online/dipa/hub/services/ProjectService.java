package online.dipa.hub.services;

import online.dipa.hub.api.model.Project;
import online.dipa.hub.api.model.ProjectTask;
import online.dipa.hub.persistence.entities.ProjectTaskTemplateEntity;

import online.dipa.hub.persistence.repositories.ProjectRepository;
import online.dipa.hub.session.model.SessionProject;
import online.dipa.hub.session.state.SessionProjectState;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;


@Service
@Transactional
public class ProjectService {

    @Autowired
    private SessionProjectState sessionProjectState;
    
    @Autowired
    private ProjectRepository projectRespository;

    @Autowired
    private ConversionService conversionService;

    public Project getProjectData(final Long projectId) {
        initializeProjects();

		return sessionProjectState.getSessionProjects().values().stream().map(SessionProject::getProject)
                .filter(t -> t.getId().equals(projectId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Project with id: %1$s not found.", projectId)));
    }

    
    private void initializeProjects() {
        projectRespository.findAll().stream().map(p -> conversionService.convert(p, Project.class))
                .filter(Objects::nonNull)
                .forEach(t -> {
                    SessionProject sessionProject = sessionProjectState.findProjectState(t.getId());
                    if (sessionProject.getProject() == null) {
                        sessionProject.setProject(t);
                    }
                });
    }
    
    public void updateProjectData(final Long projectId, final Project project) {
        SessionProject sessionProject = sessionProjectState.findProjectState(projectId);
        sessionProject.setProject(project);
    }

    private void initializeProjectTasks() {

        projectRespository.findAll().forEach(t -> {
            
            Optional<ProjectTaskTemplateEntity> projectTaskTemplate = t.getProjectTaskTemplates().stream().findFirst();

            SessionProject sessionProject = sessionProjectState.findProjectState(t.getId());

            if (projectTaskTemplate.isPresent() && sessionProject.getProjectTasks().isEmpty()) {

                ProjectTaskTemplateEntity projectTasks = projectTaskTemplate.get();

                Map<Long, ProjectTask> projectTasksMap = new HashMap<>();

                projectTasks.getProjectTasks().stream()
                    .map(p -> conversionService.convert(p, ProjectTask.class))
                    .filter(Objects::nonNull)
                    .forEach(task -> projectTasksMap.put(task.getId(), task));

                sessionProject.setProjectTasks(projectTasksMap);
        
            }
        });
    }

    public List<ProjectTask> getProjectTasks (final Long projectId) {
        
        initializeProjectTasks();

        return new ArrayList<>(sessionProjectState.findProjectState(projectId)
            .getProjectTasks()
            .values());

    }

    public void updateProjectTask (final Long projectId, final ProjectTask projectTask) {

        sessionProjectState.findProjectState(projectId).getProjectTasks().replace(projectTask.getId(), projectTask);
        
    }
}
