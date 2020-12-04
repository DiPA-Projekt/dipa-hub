package online.dipa.hub.server.rest;

import java.util.Collections;
import java.util.List;

import online.dipa.hub.api.model.Increment;
import online.dipa.hub.api.model.InlineObject;
import online.dipa.hub.services.TimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.Task;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.rest.TimelinesApi;

@RestApiController
public class TimelineController implements TimelinesApi {

    @Autowired
    private TimelineService timelineService;

    @Override
    public ResponseEntity<List<Timeline>> getTimelines() {
        final List<Timeline> timelines = timelineService.getTimelines();
        return ResponseEntity.ok(timelines);
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
        }

        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> incrementOperation(final Long timelineId, final Long increment) {
        
        timelineService.setIncrementTimeline(timelineId, increment);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<Increment>> getIncrementsForTimeline(final Long timelineId) {
        final List<Increment> incrementsList = timelineService.getIncrementsForTimeline(timelineId);
        return ResponseEntity.ok(incrementsList);
    }
    
}
