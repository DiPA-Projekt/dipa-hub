package online.dipa.hub.server.rest;

import online.dipa.hub.api.rest.MilestonesApi;

import online.dipa.hub.api.model.*;
import online.dipa.hub.services.MilestoneService;
import online.dipa.hub.services.TimelineService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@RestApiController
public class MilestoneController implements MilestonesApi{

    @Autowired
    MilestoneService milestoneService;

    @Autowired
    TimelineService timelineService;
    
    @Override
    public ResponseEntity<List<Milestone>> getMilestonesForTimeline(final Long timelineId) {
        final List<Milestone> milestoneList = milestoneService.getMilestonesForTimeline(timelineId);
        return ResponseEntity.ok(milestoneList);
    }

    
    @Override
    public ResponseEntity<Void> updateMilestoneData(final Long timelineId, final Long milestoneId, final Milestone milestone ) {
        if (Optional.ofNullable(milestone.getStatus()).isPresent()) {
            milestoneService.updateMilestoneStatus(timelineId, milestoneId, milestone.getStatus());
        }
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<DownloadFile>> getFilesForMilestone(final Long timelineId, final Long milestoneId) {
        final List<DownloadFile> attachedFilesList = timelineService.getFilesForMilestone(timelineId, milestoneId);
        return ResponseEntity.ok(attachedFilesList);
    }

    
}
