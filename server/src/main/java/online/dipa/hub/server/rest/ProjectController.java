package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.*;
import online.dipa.hub.api.rest.ProjectApi;
import online.dipa.hub.services.ProjectService;
import online.dipa.hub.services.SecurityService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestApiController
public class ProjectController implements ProjectApi {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private SecurityService securityService;

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<Project> getProjectData(final Long timelineId) {
        final Project project = projectService.getProjectData(timelineId);
        return ResponseEntity.ok(project);
    }

    @PreAuthorize("@securityService.isProjectMemberAndHasRole(#timelineId, {'PE','PL'})")
    @Override
    public ResponseEntity<Void> updateProjectData(final Long timelineId, Project project) {
        projectService.updateProjectData(timelineId, project);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<List<PermanentProjectTask>> getPermanentProjectTasks(final Long timelineId) {
        List<PermanentProjectTask> projectTasks =  projectService.getPermanentProjectTasks(timelineId);
        return ResponseEntity.ok(projectTasks);
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<List<NonPermanentProjectTask>> getNonPermanentProjectTasks(final Long timelineId) {
        List<NonPermanentProjectTask> projectTasks =  projectService.getNonPermanentProjectTasks(timelineId);
        return ResponseEntity.ok(projectTasks);
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<Void> updatePermanentProjectTasks(final Long timelineId, List<PermanentProjectTask> permanentProjectTasks) {
        projectService.updatePermanentProjectTasks(permanentProjectTasks);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<Void> updateNonPermanentProjectTasks(final Long timelineId, List<NonPermanentProjectTask> nonPermanentProjectTasks) {
        projectService.updateNonPermanentProjectTasks(nonPermanentProjectTasks);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<Void> updateProjectTask(final Long timelineId, ProjectTask projectTask) {
        projectService.updateProjectTask(timelineId, projectTask);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Timeline> createProject(ProjectWithUser projectWithUser) {
        return ResponseEntity.ok(projectService.createProject(projectWithUser.getProject(), projectWithUser.getProjectOwner()));
    }

    @PreAuthorize("@securityService.isProjectMemberAndHasRole(#timelineId, {'PE'})")
    @Override
    public ResponseEntity<Void> deleteProject(final Long timelineId) {
        projectService.deleteProject(timelineId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMember(#projectId)")
    @Override
    public ResponseEntity<List<ProjectRole>> getProjectRoles(final Long projectId) {
        return ResponseEntity.ok(projectService.getProjectRoles(projectId));
    }

    @PreAuthorize("@securityService.isProjectMember(#projectId)")
    @Override
    public ResponseEntity<List<User>> getProjectUsers(final Long projectId) {
        return ResponseEntity.ok(projectService.getProjectUsers(projectId));
    }

    @PreAuthorize("@securityService.isProjectMember(#projectId)")
    @Override
    public ResponseEntity<List<PropertyQuestion>> getProjectPropertyQuestions(final Long projectId) {
        return ResponseEntity.ok(projectService.getProjectPropertyQuestions(projectId));
    }

    @PreAuthorize("@securityService.isProjectMemberAndHasRole(#projectId, {'PE','PL'})")
    @Override
    public ResponseEntity<Void> updateProjectPropertyQuestion(final Long projectId, final PropertyQuestion propertyQuestion) {
        projectService.updateProjectPropertyQuestion(propertyQuestion);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMember(#projectId)")
    @Override
    public ResponseEntity<List<ProjectEventTemplate>> getEvents(final Long projectId) {
        return ResponseEntity.ok(projectService.getEvents(projectId));
    }

    @PreAuthorize("@securityService.isProjectMember(#projectId)")
    @Override
    public ResponseEntity<Void> updateProjectEvent(final Long projectId, final ProjectEvent projectEvent) {
        projectService.updateProjectEvent(projectEvent);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<List<FinalProjectTask>> getFinalProjectTasks(final Long timelineId) {
        List<FinalProjectTask> projectTasks =  projectService.getFinalProjectTasks(timelineId);
        return ResponseEntity.ok(projectTasks);
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<Void> updateFinalProjectTasks(final Long timelineId, List<FinalProjectTask> finalProjectTasks) {
        projectService.updateFinalProjectTasks(finalProjectTasks);
        return ResponseEntity.noContent().build();
    }

}
