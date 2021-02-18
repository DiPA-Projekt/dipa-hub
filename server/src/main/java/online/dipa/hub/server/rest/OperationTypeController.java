package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.*;
import online.dipa.hub.services.OperationTypeService;
import online.dipa.hub.api.rest.OperationTypesApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestApiController
public class OperationTypeController implements OperationTypesApi {

    @Autowired
    private OperationTypeService operationTypeService;
    
    @Override
    public ResponseEntity<List<OperationType>> getOperationTypes() {
        final List<OperationType> operationTypesList = operationTypeService.getOperationTypes();
        return ResponseEntity.ok(operationTypesList);
    }
    
}
