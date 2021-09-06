package online.dipa.hub.server.rest;

import java.util.List;

import online.dipa.hub.api.model.*;

import online.dipa.hub.services.IncrementService;
import online.dipa.hub.services.SecurityService;
import online.dipa.hub.services.TimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import online.dipa.hub.api.rest.TimelinesApi;

import org.springframework.core.io.FileUrlResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;

import java.io.File;
import java.io.IOException;

@RestApiController
public class TimelineController implements TimelinesApi {

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private IncrementService incrementService;

    @Autowired
    private SecurityService securityService;

    @Override
    public ResponseEntity<List<Timeline>> getTimelines() {
        final List<Timeline> timelines = timelineService.getTimelines();
        return ResponseEntity.ok(timelines);
    }

    @Override
    public ResponseEntity<List<Timeline>> getActiveTimelines() {
        final List<Timeline> timelines = timelineService.getActiveTimelines();
        return ResponseEntity.ok(timelines);
    }

    @Override
    public ResponseEntity<List<Timeline>> getArchivedTimelines() {
        final List<Timeline> timelines = timelineService.getArchivedTimelines();
        return ResponseEntity.ok(timelines);
    }

    @PreAuthorize("@securityService.isProjectMemberAndHasRole(#timelineId, {'PE','PL'})")
    @Override
    public ResponseEntity<Void> applyOperation(Long timelineId, InlineObject inlineObject) {

        switch (inlineObject.getOperation()) {
        case MOVE_TIMELINE:
            timelineService.moveTimelineByDays(timelineId, inlineObject.getDays());
            break;
        case MOVE_TIMELINE_START:
            timelineService.moveTimelineStartByDays(timelineId, inlineObject.getDays());
            break;
        case MOVE_TIMELINE_END:
            timelineService.moveTimelineEndByDays(timelineId, inlineObject.getDays());
            break;
        case MOVE_MILESTONE:
            timelineService.moveMileStoneByDays(timelineId, inlineObject.getDays(), inlineObject.getMovedMilestoneId());
            break;
        default:
            return ResponseEntity.notFound()
                                 .build();
        }

        return ResponseEntity.noContent()
                             .build();
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<Void> updateTimeline(final Long timelineId, Timeline timeline) {

        timelineService.updateTimeline(timeline);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
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

}
