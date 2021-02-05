package online.dipa.hub.server.rest;

import java.util.Collections;
import java.util.List;

import online.dipa.hub.api.model.*;

import online.dipa.hub.services.TimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import liquibase.pro.packaged.M;
import online.dipa.hub.api.rest.TimelinesApi;

import org.springframework.core.io.FileUrlResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

import javax.validation.Valid;

import online.dipa.hub.services.ProjectService;

@RestApiController
public class TimelineController implements TimelinesApi {

    @Autowired
    private TimelineService timelineService;
    
    @Autowired
    private ProjectService projectService;

    @Override
    public ResponseEntity<List<Timeline>> getTimelines() {
        final List<Timeline> timelines = timelineService.getTimelines();
        return ResponseEntity.ok(timelines);
    }

    @Override
    public ResponseEntity<List<OperationType>> getOperationTypes() {
        final List<OperationType> operationTypesList = timelineService.getOperationTypes();
        return ResponseEntity.ok(operationTypesList);
    }

    @Override
    public ResponseEntity<List<ProjectApproach>> getProjectApproaches() {
        final List<ProjectApproach> projectApproachList = timelineService.getProjectApproaches();
        return ResponseEntity.ok(projectApproachList);
    }

    @Override
    public ResponseEntity<List<Milestone>> getMilestonesForTimeline(final Long timelineId) {
        final List<Milestone> milestoneList = timelineService.getMilestonesForTimeline(timelineId);
        return ResponseEntity.ok(milestoneList);
    }

    @Override
    public ResponseEntity<List<Task>> getTasksForTimeline(final Long timelineId) {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @Override
    public ResponseEntity<Void> applyOperation(Long timelineId, InlineObject inlineObject) {

        switch (inlineObject.getOperation()) {
            case "moveTimeline": timelineService.moveTimelineByDays(timelineId, inlineObject.getDays());
                break;
            case "moveTimelineStart": timelineService.moveTimelineStartByDays(timelineId, inlineObject.getDays());
                break;
            case "moveTimelineEnd": timelineService.moveTimelineEndByDays(timelineId, inlineObject.getDays());
                break;
            case "moveMilestone": timelineService.moveMileStoneByDays(timelineId, inlineObject.getDays(), inlineObject.getMovedMilestoneId());
                break;
            default:
                return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> addIncrement(final Long timelineId) {
        timelineService.addIncrement(timelineId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> deleteIncrement(final Long timelineId) {

        timelineService.deleteIncrement(timelineId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<Increment>> getIncrementsForTimeline(final Long timelineId) {
        final List<Increment> incrementsList = timelineService.getIncrementsForTimeline(timelineId);
        return ResponseEntity.ok(incrementsList);
    }

    @Override
    public ResponseEntity<Void> updateTimeline(final Long timelineId, Timeline timeline) {

        timelineService.updateTimeline(timeline);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> updateMilestoneData(final Long timelineId, final Long milestoneId, final Milestone milestone ) {
        if (Optional.ofNullable(milestone.getStatus()).isPresent()) {
            timelineService.updateMilestoneStatus(timelineId, milestoneId, milestone.getStatus());
        }
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Resource> getTimelineCalendar(final Long timelineId) {

        try {
            File icsFile = timelineService.getCalendarFileForTimeline(timelineId);
            FileUrlResource icsFileResource = new FileUrlResource(icsFile.getPath());
            // Access-Control-Expose-Headers
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/octet-stream"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + icsFile.getName() + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                    .body(icsFileResource);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<List<Template>> getTemplatesForTimeline(final Long timelineId) {
        final List<Template> templateList = timelineService.getTemplatesForTimeline(timelineId);
        return ResponseEntity.ok(templateList);
    }

    @Override
    public ResponseEntity<Void> updateTemplate(final Long timelineId, final Long templateId) {
        timelineService.updateTemplateForProject(timelineId, templateId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<DownloadFile>> getFilesForMilestone(final Long timelineId, final Long milestoneId) {
        final List<DownloadFile> attachedFilesList = timelineService.getFilesForMilestone(timelineId, milestoneId);
        return ResponseEntity.ok(attachedFilesList);
    }

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
    public ResponseEntity<Void> updateMissions(final Long timelineId, List<Result> results) {
    
        // for (Mission mission: missions){
            // System.out.println(mission.getName());
            // Result results = mission.getResult();
            // System.out.println(results.toString());
            // for (Result result: results){
            //                 System.out.println(result.toString());

            //     System.out.println(result.getStandardResult());
            //     System.out.println(result.getElBEshoppingCartResult());
            // }
        // }
        System.out.println(results.toString());
        return ResponseEntity.noContent().build();
    }


}
