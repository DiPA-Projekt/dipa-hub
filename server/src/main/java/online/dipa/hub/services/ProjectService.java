package online.dipa.hub.services;

import online.dipa.hub.api.model.Project;
import online.dipa.hub.api.model.ProjectTask;

import online.dipa.hub.mapper.ProjectProjectEntityMapper;
import online.dipa.hub.mapper.ProjectTaskProjectTaskEntityMapper;
import online.dipa.hub.persistence.entities.*;
import online.dipa.hub.persistence.repositories.*;

import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

import java.util.*;
import java.util.stream.Collectors;


@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRespository;

    @Autowired
    private ElbeShoppingCartResultRepository elbeShoppingCartResultRepository;

    @Autowired
    private RiskResultRepository riskResultRepository;

    @Autowired
    private AppointmentSeriesResultRepository apptSeriesResultRepository;

    @Autowired
    private ContactPersonResultRepository contactPersonResultRepository;

    @Autowired
    private SingleAppointmentResultRepository singleAppointmentResultRepository;

    @Autowired
    private ConversionService conversionService;

    private final ProjectProjectEntityMapper projectMapper = Mappers.getMapper(ProjectProjectEntityMapper.class);
    private final ProjectTaskProjectTaskEntityMapper projectTaskMapper = Mappers.getMapper(ProjectTaskProjectTaskEntityMapper.class);


    public Project getProjectData(final Long projectId) {

        return projectRespository.findAll().stream().map(p -> conversionService.convert(p, Project.class))
        .filter(t -> t.getId().equals(projectId)).findFirst().orElseThrow(() -> new EntityNotFoundException(
                        String.format("Project with id: %1$s not found.", projectId)));
                
    }
    
    public void updateProjectData(final Long projectId, final Project project) {

        projectRespository.findAll().stream()
            .filter(t -> t.getId().equals(projectId)).findFirst()
            .ifPresent(projectEntity -> 
                projectMapper.updateProjectEntity(project, projectEntity)
            );

    }

    public List<ProjectTask> getProjectTasks (final Long projectId) {

        List<ProjectTask> projectTasks = new ArrayList<ProjectTask>();

        projectRespository.findAll().stream().filter(t -> t.getId().equals(projectId))
        .findFirst().ifPresent(project -> {

            Optional<ProjectTaskTemplateEntity> template = project.getProjectTaskTemplates().stream().findFirst();

            if (template.isPresent() && !project.getProjectSize().equals("BIG")) {

                projectTasks.addAll(template.get().getProjectTasks()
                .stream().map(p -> conversionService.convert(p, ProjectTask.class))
                .sorted(Comparator.comparing(ProjectTask::getId))
                .collect(Collectors.toList()));
            }

        });

        return projectTasks;
        
    }

    public void updateProjectTask (final Long projectId, final ProjectTask projectTask) {

        Optional<ProjectTaskEntity> oldProjectTask = projectRespository.findAll().stream()
        .filter(t -> t.getId().equals(projectId)).findFirst().get()
        .getProjectTaskTemplates().stream().findFirst().get().getProjectTasks().stream().filter(t -> t.getId().equals(projectTask.getId())).findFirst();

        projectTaskMapper.updateProjectTaskEntity(projectTask, oldProjectTask.get(), 
        elbeShoppingCartResultRepository, riskResultRepository,
        contactPersonResultRepository, singleAppointmentResultRepository, apptSeriesResultRepository);

    }
    
}
