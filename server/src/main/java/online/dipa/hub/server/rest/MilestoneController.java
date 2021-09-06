package online.dipa.hub.server.rest;

import online.dipa.hub.api.rest.MilestonesApi;

import online.dipa.hub.api.model.*;
import online.dipa.hub.services.MilestoneService;
import online.dipa.hub.services.SecurityService;
import online.dipa.hub.services.TimelineService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestApiController
public class MilestoneController implements MilestonesApi{

    @Autowired
    MilestoneService milestoneService;

    @Autowired
    TimelineService timelineService;

    @Autowired
    private SecurityService securityService;

    @PreAuthorize("hasRole('ROLE_PMO') or @securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<List<Milestone>> getMilestonesForTimeline(final Long timelineId) {
        final List<Milestone> milestoneList = milestoneService.getMilestonesForTimeline(timelineId);
        return ResponseEntity.ok(milestoneList);
    }

    @PreAuthorize("@securityService.isProjectMemberAndHasRole(#timelineId, {'PE','PL'})")
    @Override
    public ResponseEntity<Void> updateMilestoneData(final Long timelineId, final Milestone milestone) {
         milestoneService.updateMilestoneData(milestone.getId(), milestone);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMemberAndHasRole(#timelineId, {'PE','PL'})")
    @Override
    public ResponseEntity<Void> deleteMilestone(final Long timelineId, final Long milestoneId) {
        milestoneService.deleteMilestone(timelineId, milestoneId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMemberAndHasRole(#timelineId, {'PE','PL'})")
    @Override
    public ResponseEntity<Void> createMilestone(final Long timelineId, final Milestone milestone) {
        milestoneService.createMilestone(timelineId, milestone);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<List<DownloadFile>> getFilesForMilestone(final Long timelineId, final Long milestoneId) {
        final List<DownloadFile> attachedFilesList = timelineService.getFilesForMilestone(timelineId, milestoneId);
        return ResponseEntity.ok(attachedFilesList);
    }

    
}
