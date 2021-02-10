package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.*;
import online.dipa.hub.services.ProjectApproachService;
import online.dipa.hub.api.rest.ProjectApproachesApi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestApiController
public class ProjectApproachController implements ProjectApproachesApi{
    
    @Autowired
    private ProjectApproachService projectApproachService;

    @Override
    public ResponseEntity<List<ProjectApproach>> getProjectApproaches() {
        final List<ProjectApproach> projectApproachList = projectApproachService.getProjectApproaches();
        return ResponseEntity.ok(projectApproachList);
    }

}
