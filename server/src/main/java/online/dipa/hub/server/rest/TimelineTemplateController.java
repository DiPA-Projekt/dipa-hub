package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.*;
import online.dipa.hub.api.rest.TimelineTemplatesApi;
import online.dipa.hub.services.TimelineTemplateService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestApiController
public class TimelineTemplateController implements TimelineTemplatesApi {

   @Autowired
   TimelineTemplateService timelineTemplateService;

   @Override
   public ResponseEntity<List<TimelineTemplate>> getTemplatesForTimeline(final Long timelineId) {
       final List<TimelineTemplate> timelineTemplates = timelineTemplateService.getTemplatesForTimeline(timelineId);
       return ResponseEntity.ok(timelineTemplates);
   }

   @Override
   public ResponseEntity<Void> updateTemplate(final Long timelineId, final Long templateId) {
       timelineTemplateService.updateTemplateForProject(timelineId, templateId);
       return ResponseEntity.noContent().build();
   }

}
