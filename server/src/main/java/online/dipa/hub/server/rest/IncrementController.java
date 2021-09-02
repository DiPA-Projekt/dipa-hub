package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.*;
import online.dipa.hub.api.rest.IncrementsApi;
import online.dipa.hub.services.IncrementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestApiController
public class IncrementController implements IncrementsApi {

    @Autowired
    private IncrementService incrementService;

    @PreAuthorize("hasRole('ROLE_PMO') or @securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<List<Increment>> getIncrementsForTimeline(final Long timelineId) {
        final List<Increment> incrementsList = incrementService.getIncrementsForTimeline(timelineId);

        return ResponseEntity.ok(incrementsList);
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<Void> addIncrement(final Long timelineId) {
        incrementService.addIncrement(timelineId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<Void> deleteIncrement(final Long timelineId) {
        incrementService.deleteIncrement(timelineId);
        return ResponseEntity.noContent().build();
    }


}

