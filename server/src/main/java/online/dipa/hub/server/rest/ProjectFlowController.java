package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.ProjectFlowStep;
import online.dipa.hub.api.rest.ProjectFlowApi;
import online.dipa.hub.services.ProjectFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestApiController
public class ProjectFlowController implements ProjectFlowApi {

    @Autowired
    private ProjectFlowService projectFlowService;

    @Override
    public ResponseEntity<List<ProjectFlowStep>> getProjectFlow() {
        final List<ProjectFlowStep> projectFlow = projectFlowService.getProjectFlow();
        return ResponseEntity.ok(projectFlow);
    }
}
