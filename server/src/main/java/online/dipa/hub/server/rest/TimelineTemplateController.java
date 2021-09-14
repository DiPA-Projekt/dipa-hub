package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.*;
import online.dipa.hub.api.rest.TimelineTemplatesApi;
import online.dipa.hub.services.SecurityService;
import online.dipa.hub.services.TimelineTemplateService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestApiController
public class TimelineTemplateController implements TimelineTemplatesApi {

    @Autowired
    TimelineTemplateService timelineTemplateService;

    @Autowired
    private SecurityService securityService;

    @PreAuthorize("@securityService.isProjectMember(#timelineId)")
    @Override
    public ResponseEntity<List<TimelineTemplate>> getTemplatesForTimeline(final Long timelineId) {
        final List<TimelineTemplate> timelineTemplates = timelineTemplateService.getTemplatesForTimeline(timelineId);
        return ResponseEntity.ok(timelineTemplates);
    }

    @PreAuthorize("@securityService.isProjectMemberAndHasRole(#timelineId, {'PE','PL'})")
    @Override
    public ResponseEntity<Void> updateTimelineTemplate(final Long timelineId, final Long templateId) {
        timelineTemplateService.updateTimelineTemplate(timelineId, templateId);
        return ResponseEntity.noContent().build();
    }

}
