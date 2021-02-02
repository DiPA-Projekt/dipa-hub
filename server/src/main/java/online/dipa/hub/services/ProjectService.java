package online.dipa.hub.services;

import online.dipa.hub.api.model.*;
import online.dipa.hub.ProjectState;

import online.dipa.hub.persistence.repositories.*;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.SessionScope;



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
                .forEach(t -> {
                    ProjectState sessionProject = findProjectState(t.getId());
                    if (sessionProject.getProject() == null) {
                        sessionProject.setProject(t);
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
}
