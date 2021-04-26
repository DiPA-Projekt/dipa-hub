package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.*;
import online.dipa.hub.api.rest.ProjectApi;
import online.dipa.hub.services.ProjectService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;


@RestApiController
public class ProjectController implements ProjectApi {

    @Autowired
    private ProjectService projectService;


    @Override
    public ResponseEntity<Project> getProjectData(final Long timelineId) {
        final Project project = projectService.getProjectData(timelineId);
        return ResponseEntity.ok(project);
    }

    @Override
    public ResponseEntity<Void> updateProjectData(final Long timelineId, Project project) {
        projectService.updateProjectData(timelineId, project);
        return ResponseEntity.noContent().build();
    }
    
    @Override
    public ResponseEntity<List<ProjectTask>> getProjectTasks(final Long timelineId) {
        List<ProjectTask> projectTasks =  projectService.getProjectTasks(timelineId);
        return ResponseEntity.ok(projectTasks);
    }

    @Override
    public ResponseEntity<Void> updateProjectTask(final Long timelineId, ProjectTask projectTask) {
        projectService.updateProjectTask(timelineId, projectTask);
        return ResponseEntity.noContent().build();
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @Override
    public ResponseEntity<Timeline> createProject(Project project) {
        return ResponseEntity.ok(projectService.createProject(project));
    }

}
