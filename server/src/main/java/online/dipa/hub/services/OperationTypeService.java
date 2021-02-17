package online.dipa.hub.services;

import online.dipa.hub.api.model.OperationType;
import online.dipa.hub.persistence.repositories.OperationTypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OperationTypeService {

    @Autowired
    private OperationTypeRepository operationTypeRepository;

    @Autowired
    private ConversionService conversionService;


    public List<OperationType> getOperationTypes() {

        return operationTypeRepository.findAll().stream().map(p -> conversionService.convert(p, OperationType.class))
                .collect(Collectors.toList());
    }
    
}
