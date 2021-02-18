package online.dipa.hub.services;

import online.dipa.hub.api.model.ProjectFlowStep;
import online.dipa.hub.persistence.repositories.ProjectFlowStepRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectFlowService {

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ProjectFlowStepRepository projectFlowStepRepository;

    public List<ProjectFlowStep> getProjectFlow() {

        return projectFlowStepRepository.findAll()
                .stream()
                .map(p -> conversionService.convert(p, ProjectFlowStep.class))
                .collect(Collectors.toList());
    }

}