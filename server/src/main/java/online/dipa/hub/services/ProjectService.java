package online.dipa.hub.services;

import online.dipa.hub.api.model.Project;

import online.dipa.hub.persistence.repositories.ProjectRepository;
import online.dipa.hub.session.model.SessionProject;
import online.dipa.hub.session.state.SessionProjectState;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.SessionScope;

import javax.persistence.EntityNotFoundException;
import java.util.Objects;


@Service
@SessionScope
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
}
