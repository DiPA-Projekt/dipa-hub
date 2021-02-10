package online.dipa.hub.server.rest;

import java.util.Collections;
import java.util.List;

import org.springframework.http.ResponseEntity;

import online.dipa.hub.api.model.Task;
import online.dipa.hub.api.rest.TasksApi;

@RestApiController
public class TaskController implements TasksApi {

   @Override
   public ResponseEntity<List<Task>> getTasksForTimeline(final Long timelineId) {
       return ResponseEntity.ok(Collections.emptyList());
   }
    
}
