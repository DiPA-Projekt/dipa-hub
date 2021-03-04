package online.dipa.hub.services;

import online.dipa.hub.api.model.ProjectApproach;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.repositories.ProjectApproachRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

@Service
@Transactional
public class ProjectApproachService {
    
    @Autowired
    private ProjectApproachRepository projectApproachRepository;

    @Autowired
    private ConversionService conversionService;

    public List<ProjectApproach> getProjectApproaches() {

        return projectApproachRepository.findAll().stream()
                .map(p -> conversionService.convert(p, ProjectApproach.class)).collect(Collectors.toList());
    }

    public ProjectApproachEntity getProjectApproachFromRepo (final Long projectApproachId) {

        return projectApproachRepository.findAll().stream()
                .filter(p -> p.getId().equals(projectApproachId))
                .findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Project Approach with id: %1$s not found.", projectApproachId)));
    }

    
}
