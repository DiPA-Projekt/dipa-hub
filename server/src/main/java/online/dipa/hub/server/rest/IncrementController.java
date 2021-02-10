package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.*;
import online.dipa.hub.api.rest.IncrementsApi;
import online.dipa.hub.services.IncrementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestApiController
public class IncrementController implements IncrementsApi {

    @Autowired
    private IncrementService incrementService;

    @Override
    public ResponseEntity<List<Increment>> getIncrementsForTimeline(final Long timelineId) {
        final List<Increment> incrementsList = incrementService.getIncrementsForTimeline(timelineId);
        return ResponseEntity.ok(incrementsList);
    }
    
    public ResponseEntity<Void> addIncrement(final Long timelineId) {
        incrementService.addIncrement(timelineId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> deleteIncrement(final Long timelineId) {
        incrementService.deleteIncrement(timelineId);
        return ResponseEntity.noContent().build();
    }


}

