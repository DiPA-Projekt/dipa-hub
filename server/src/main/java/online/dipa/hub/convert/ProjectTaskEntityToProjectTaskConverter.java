package online.dipa.hub.convert;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.ProjectTask;
import online.dipa.hub.api.model.ProjectTaskResults;
import online.dipa.hub.api.model.Result;
import online.dipa.hub.persistence.entities.ProjectTaskEntity;


@Component
public class ProjectTaskEntityToProjectTaskConverter implements Converter<ProjectTaskEntity, ProjectTask> {

    
    @Autowired
    private StandardResultEntityToStandardResult standardResultConverter;
    
    @Autowired
    private ContactPersonResultEntityToContactPersonResultConverter contactPersonResultConverter;

    @Autowired
    private ElbeShoppingCartResultEntityToElbeShoppingCartResultConverter elbeShoppingCartResultConverter;
    
    @Autowired
    private ApptSeriesResultEntityToApptSeriesResultConverter apptSeriesResultConverter;
    
    @Autowired
    private RiskResultEntityToRiskResultConverter riskResultConverter;
    
    @Autowired
    private SingleApptResultEntityToSingleApptResultConverter singleApptResultConverter;

    @Override
    public ProjectTask convert(final ProjectTaskEntity template) {

        ProjectTask projectTask = new ProjectTask().id(template.getId())
                             .title(template.getTitle())
                             .optional(template.getOptional())
                             .explanation(template.getExplanation())
                             .contactPerson(template.getContactPerson())
                             .documentationLink(template.getDocumationLink());
                            
        if (!template.getStandardResult().isEmpty()) {
            List<Result> standardResults = template.getStandardResult().stream().map(p -> standardResultConverter.convert(p)).collect(Collectors.toList());
            projectTask.results(new ProjectTaskResults().type("TYPE_STD").data(standardResults));
            
        }
        else if (!template.getContactPersonResult().isEmpty()) {
            List<Result> contactPersonResults = template.getContactPersonResult().stream().map(p -> contactPersonResultConverter.convert(p)).collect(Collectors.toList());
            projectTask.results(new ProjectTaskResults().type("TYPE_CONTACT_PERS").data(contactPersonResults));

        }
        else if (!template.getAppointmentSeriesResults().isEmpty()) {
            List<Result> apptSeriesResults = template.getAppointmentSeriesResults().stream().map(p -> apptSeriesResultConverter.convert(p)).collect(Collectors.toList());
            projectTask.results(new ProjectTaskResults().type("TYPE_APPT_SERIES").data(apptSeriesResults));

        }
        else if (!template.getELBEShoppingCartResults().isEmpty()) {
            List<Result> elbeShoppingCaResults = template.getELBEShoppingCartResults().stream().map(p -> elbeShoppingCartResultConverter.convert(p)).collect(Collectors.toList());
            projectTask.results(new ProjectTaskResults().type("TYPE_ELBE_SC").data(elbeShoppingCaResults));
        }
        else if (!template.getSingleAppointmentResults().isEmpty()) {
            List<Result> singleApptResults = template.getSingleAppointmentResults().stream().map(p -> singleApptResultConverter.convert(p)).collect(Collectors.toList());
            projectTask.results(new ProjectTaskResults().type("TYPE_SINGLE_APPOINTMENT").data(singleApptResults));
        }
        else if (!template.getRiskResults().isEmpty()) {
            List<Result> riskResults = template.getRiskResults().stream().map(p -> riskResultConverter.convert(p)).collect(Collectors.toList());
            projectTask.results(new ProjectTaskResults().type("TYPE_RISK").data(riskResults));
        }
                
        return projectTask;
    }
}
