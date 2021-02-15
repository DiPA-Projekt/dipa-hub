package online.dipa.hub.convert;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Project;
import online.dipa.hub.api.model.ProjectTask;
import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.entities.ProjectTaskEntity;

@Component
public class ProjectTaskEntityToProjectTaskConverter implements Converter<ProjectTaskEntity, ProjectTask> {

    @Autowired
    private ContactPersonResultEntityToContactPersonResultConverter contactPersonResultConverter;

    @Override
    public ProjectTask convert(final ProjectTaskEntity template) {

        ProjectTask projectTask = new ProjectTask().id(template.getId())
                             .title(template.getTitle())
                             .optional(template.getOptional())
                             .explanation(template.getExplanation())
                             .contactPerson(template.getContactPerson())
                             .documentationLink(template.getDocumationLink());
                            
        System.out.println(template.getTitle());
        if (template.getStandardResult() != null) {
            // projectTask.results(template.getStandardResult());
            System.out.println(template.getStandardResult());
        }
        else if (template.getContactPersonResult() != null) {
            projectTask.results(template.getContactPersonResult().stream().map(p -> contactPersonResultConverter.convert(p)).collect(Collectors.toList()));
            System.out.println(projectTask.getResults().get(0));
            System.out.println(template.getContactPersonResult());

        }
        else if (template.getAppointmentSeriesResults() != null) {
            // projectTask.results(template.getContactPersonResult())
            System.out.println(template.getAppointmentSeriesResults());
        }
        else if (template.getELBEShoppingCartResults() != null) {
            System.out.println(template.getELBEShoppingCartResults());
        }
                
        return projectTask;
    }
}
