package online.dipa.hub.services;

import online.dipa.hub.ProjectState;
import online.dipa.hub.api.model.Project;
import online.dipa.hub.api.model.ProjectTask;
import online.dipa.hub.persistence.entities.ProjectTaskTemplateEntity;

import online.dipa.hub.persistence.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.SessionScope;

import javax.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@SessionScope
@Transactional
public class ProjectService {
    
    private Map<Long, ProjectState> sessionProjects;

    @Autowired
    private ProjectRepository projectRespository;

    @Autowired
    private ConversionService conversionService;

    public Project getProjectData(final Long projectId) {
        initializeProjects();

		return this.sessionProjects.values().stream().map(ProjectState::getProject)
                .filter(t -> t.getId().equals(projectId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Project with id: %1$s not found.", projectId)));
    }

    
    private void initializeProjects() {
        projectRespository.findAll().stream().map(p -> conversionService.convert(p, Project.class))
                .filter(Objects::nonNull)
                .forEach(t -> {
                    ProjectState sessionProject = findProjectState(t.getId());
                    if (sessionProject.getProject() == null) {
                        sessionProject.setProject(t);
                    }
                });
    }

    private void initializeProjectTasks() {

        projectRespository.findAll().stream().forEach(t -> {
            
            Optional<ProjectTaskTemplateEntity> projectTaskTemplate = t.getProjectTaskTemplates().stream().findFirst();

            ProjectState sessionProject = findProjectState(t.getId());

            if (projectTaskTemplate.isPresent() && sessionProject.getProjectTasks().isEmpty()) {

                ProjectTaskTemplateEntity projectTasks = projectTaskTemplate.get();

                Map<Long, ProjectTask> projectTasksMap = new HashMap<>();

                projectTasks.getProjectTasks().stream()
                    .map(p -> conversionService.convert(p, ProjectTask.class))
                    .filter(Objects::nonNull)
                    .forEach(task -> {
                        projectTasksMap.put(task.getId(), task);
                    });

                sessionProject.setProjectTasks(projectTasksMap);
        
            }
        });
    }

    
    private ProjectState findProjectState(final Long projectId) {
        return getSessionProjects().computeIfAbsent(projectId, t -> new ProjectState());
    }

    private Map<Long, ProjectState> getSessionProjects() {
        if (this.sessionProjects == null) {
            this.sessionProjects = new HashMap<>();
        }
        return this.sessionProjects;
    }

    public void updateProjectData(final Long projectId, final Project project) {
        ProjectState sessionProject = findProjectState(projectId);
        sessionProject.setProject(project);
    }

    public List<ProjectTask> getProjectTasks (final Long projectId) {
        
        initializeProjectTasks();

        return findProjectState(projectId)
            .getProjectTasks()
            .entrySet()
            .stream()
            .map(t -> t.getValue())
            .collect(Collectors.toList());

    }

    public void updateProjectTask (final Long projectId, final Long taskId, final ProjectTask projectTask) {

        ProjectState sessionProject = findProjectState(projectId);
        sessionProject.getProjectTasks().replace(taskId, projectTask);
        
    }
}
