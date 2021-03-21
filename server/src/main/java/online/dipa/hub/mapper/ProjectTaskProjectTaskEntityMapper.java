package online.dipa.hub.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.*;
import online.dipa.hub.api.model.*;
import online.dipa.hub.persistence.entities.*;

import online.dipa.hub.persistence.repositories.*;


@Mapper(componentModel = "spring")
public interface ProjectTaskProjectTaskEntityMapper 
        extends FormFieldMapper {


    void updateProjectTaskEntity(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity,@Context ElbeShoppingCartResultRepository elbeShoppingCartResultRepository,
    @Context RiskResultRepository riskResultRepository, @Context ContactPersonResultRepository contactPersonResultRepository,
    @Context SingleAppointmentResultRepository singleApptResultRepository, @Context AppointmentSeriesResultRepository apptSeriesResultRepository,
    @Context FormFieldRepository formFieldRepository);

    // void updateFormFieldEntity(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity,@Context FormFieldRepository formFieldRepository);

    // @AfterMapping
    // default void setFormFields(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity,@Context FormFieldRepository formFieldRepository) {
    //     List<FormFieldEntity> oldEntriesList = new ArrayList<>(projectTaskEntity.getFormFields());
    //     List<FormField> newList = projectTask.getEntries().stream().map(FormField.class::cast).collect(Collectors.toList());

    //     for (int i = 0; i < newList.size(); i++) {

    //         if (i > oldEntriesList.size() - 1) {

    //             FormFieldEntity entity = toFormFieldEntity(newList.get(i));
    //             entity.setId(formFieldRepository.count() + 1);
    //             entity.setProjectTask(projectTaskEntity);

    //             formFieldRepository.save(entity);

    //         }
    //         else {
    //             updateFormField(newList.get(i), oldEntriesList.get(i));
    //         }
    //     }
    // }

    @AfterMapping
	default void setResults(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity, @Context ElbeShoppingCartResultRepository elbeShoppingCartResultRepository,
    @Context RiskResultRepository riskResultRepository, @Context ContactPersonResultRepository contactPersonResultRepository,
    @Context SingleAppointmentResultRepository singleApptResultRepository, @Context AppointmentSeriesResultRepository apptSeriesResultRepository,
    @Context FormFieldRepository formFieldRepository){


        List<FormFieldEntity> oldEntriesList = new ArrayList<>(projectTaskEntity.getFormFields());
        List<FormField> newList = projectTask.getEntries().stream().map(FormField.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldEntriesList.size() - 1) {

                FormFieldEntity entity = toFormFieldEntity(newList.get(i));
                entity.setId(formFieldRepository.count() + 1);
                entity.setProjectTask(projectTaskEntity);

                formFieldRepository.save(entity);

            }
            else {
                updateFormField(newList.get(i), oldEntriesList.get(i));
            }
        }
        String resultType = projectTask.getResults().getType();

        switch (resultType) {
            case "TYPE_STD":
                updateStandardResults(projectTaskEntity, projectTask);
                break;
            case "TYPE_ELBE_SC":
                updateShoppingCartResults(projectTaskEntity, projectTask, elbeShoppingCartResultRepository, formFieldRepository);
                break;
            case "TYPE_CONTACT_PERS":
                updateContactPersonResults(projectTaskEntity, projectTask, contactPersonResultRepository, formFieldRepository);
                break;
            case "TYPE_APPT_SERIES":
                updateApptSeriesResults(projectTaskEntity, projectTask, apptSeriesResultRepository, formFieldRepository);
                break;
            case "TYPE_RISK":
                updateRiskResults(projectTaskEntity, projectTask, riskResultRepository, formFieldRepository);
                break;
            case "TYPE_SINGLE_APPOINTMENT":
                updateSingleApptResults(projectTaskEntity, projectTask, singleApptResultRepository, formFieldRepository);
                break;
        }
    }

    default void updateStandardResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask) {
        List<StandardResultEntity> oldList = new ArrayList<>(projectTaskEntity.getStandardResult());
        List<StandardResult> newList = projectTask.getResults().getData().stream().map(StandardResult.class::cast).collect(Collectors.toList());

     
        List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldList.get(0).getFormFields());
        List<FormField> newListEntries = newList.get(0).getFormFields();


       for (int i = 0; i < newListEntries.size(); i++) {
           updateFormField(newListEntries.get(i), oldEntriesList.get(i));
       }
    }
    

    default void updateShoppingCartResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, 
    ElbeShoppingCartResultRepository elbeShoppingCartResultRepository, FormFieldRepository formFieldRepository) {
            
        List<ELBEShoppingCartResultEntity> oldList = new ArrayList<>(projectTaskEntity.getELBEShoppingCartResults());
        List<ELBEshoppingCartResult> newList = projectTask.getResults().getData().stream().map(ELBEshoppingCartResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {
                
                ELBEShoppingCartResultEntity entity = new ELBEShoppingCartResultEntity();
                entity.setId(elbeShoppingCartResultRepository.count() + 1);
                entity.setResultType("TYPE_ELBE_SC");
                entity.setProjectTask(projectTaskEntity);
                elbeShoppingCartResultRepository.save(entity);

                List<FormField> newListEntries = newList.get(i).getFormFields();

                for (FormField newListEntry : newListEntries) {
                    FormFieldEntity formField = toFormFieldEntity(newListEntry);

                    formField.setId(formFieldRepository.count() + 1);
                    formField.setELBEShoppingCartResults(entity);

                    formFieldRepository.save(formField);
                }
                

            }
            else {
                List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldList.get(i).getFormFields());
                List<FormField> newListEntries = newList.get(i).getFormFields();
       
                
                for (int j = 0; j < newListEntries.size(); j++) {
                    updateFormField(newListEntries.get(j), oldEntriesList.get(j));
                }    
                // updateShoppingCartResult(newList.get(i), oldList.get(i));
            }

        }
    }

    default void updateContactPersonResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, 
    ContactPersonResultRepository contactPersonResultRepository, FormFieldRepository formFieldRepository) {
        
        List<ContactPersonResultEntity> oldList = new ArrayList<>(projectTaskEntity.getContactPersonResult());
        List<ContactPersonResult> newList = projectTask.getResults().getData().stream().map(ContactPersonResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {
                
                ContactPersonResultEntity entity = new ContactPersonResultEntity();
                entity.setId(contactPersonResultRepository.count() + 1);
                entity.setResultType("TYPE_CONTACT_PERS");
                entity.setProjectTask(projectTaskEntity);
                contactPersonResultRepository.save(entity);

                List<FormField> newListEntries = newList.get(i).getFormFields();

                for (FormField newListEntry : newListEntries) {
                    FormFieldEntity formField = toFormFieldEntity(newListEntry);

                    formField.setId(formFieldRepository.count() + 1);
                    formField.setContactPersonResultEntity(entity);

                    formFieldRepository.save(formField);
                }
                

            }
            else {
                List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldList.get(i).getFormFields());
                List<FormField> newListEntries = newList.get(i).getFormFields();
            
                for (int j = 0; j < newListEntries.size(); j++) {
                    updateFormField(newListEntries.get(j), oldEntriesList.get(j));
                }    
                // updateShoppingCartResult(newList.get(i), oldList.get(i));
            }
        }

    }

    default void updateApptSeriesResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, 
    AppointmentSeriesResultRepository apptSeriesResultRepository, FormFieldRepository formFieldRepository) {
        
        List<AppointmentSeriesResultEntity> oldList = new ArrayList<>(projectTaskEntity.getAppointmentSeriesResults());
        List<AppointmentSeriesResult> newList = projectTask.getResults().getData().stream().map(AppointmentSeriesResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {
                
                AppointmentSeriesResultEntity entity = new AppointmentSeriesResultEntity();
                entity.setId(apptSeriesResultRepository.count() + 1);
                entity.setResultType("TYPE_APPT_SERIES");
                entity.setProjectTask(projectTaskEntity);
                apptSeriesResultRepository.save(entity);

                List<FormField> newListEntries = newList.get(i).getFormFields();

                for (FormField newListEntry : newListEntries) {
                    FormFieldEntity formField = toFormFieldEntity(newListEntry);

                    formField.setId(formFieldRepository.count() + 1);
                    formField.setAppointmentSeriesResultEntity(entity);

                    formFieldRepository.save(formField);
                }
                

            }
            else {
                List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldList.get(i).getFormFields());
                List<FormField> newListEntries = newList.get(i).getFormFields();
            
                for (int j = 0; j < newListEntries.size(); j++) {
                    updateFormField(newListEntries.get(j), oldEntriesList.get(j));
                }    
                // updateShoppingCartResult(newList.get(i), oldList.get(i));
            }
        }
    }

    default void updateRiskResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask,
     RiskResultRepository riskResultRepository, FormFieldRepository formFieldRepository) {
        
        List<RiskResultEntity> oldList = new ArrayList<>(projectTaskEntity.getRiskResults());
        List<RiskResult> newList = projectTask.getResults().getData().stream().map(RiskResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {
                
                RiskResultEntity entity = new RiskResultEntity();
                entity.setId(riskResultRepository.count() + 1);
                entity.setResultType("TYPE_RISK");
                entity.setProjectTask(projectTaskEntity);
                riskResultRepository.save(entity);

                List<FormField> newListEntries = newList.get(i).getFormFields();

                for (FormField newListEntry : newListEntries) {
                    FormFieldEntity formField = toFormFieldEntity(newListEntry);

                    formField.setId(formFieldRepository.count() + 1);
                    formField.setRiskResult(entity);

                    formFieldRepository.save(formField);
                }
                

            }
            else {
                List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldList.get(i).getFormFields());
                List<FormField> newListEntries = newList.get(i).getFormFields();
            
                for (int j = 0; j < newListEntries.size(); j++) {
                    updateFormField(newListEntries.get(j), oldEntriesList.get(j));
                }    
                // updateShoppingCartResult(newList.get(i), oldList.get(i));
            }
        }
    }

    default void updateSingleApptResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, 
    SingleAppointmentResultRepository singleApptResultRepository, FormFieldRepository formFieldRepository) {
        
        List<SingleAppointmentResultEntity> oldList = new ArrayList<>(projectTaskEntity.getSingleAppointmentResults());
        List<SingleAppointmentResult> newList = projectTask.getResults().getData().stream().map(SingleAppointmentResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {
                
                SingleAppointmentResultEntity entity = new SingleAppointmentResultEntity();
                entity.setId(singleApptResultRepository.count()+ 1);
                entity.setResultType("TYPE_SINGLE_APPOINTMENT");
                entity.setProjectTask(projectTaskEntity);
                singleApptResultRepository.save(entity);

                List<FormField> newListEntries = newList.get(i).getFormFields();

                for (FormField newListEntry : newListEntries) {
                    FormFieldEntity formField = toFormFieldEntity(newListEntry);

                    formField.setId(formFieldRepository.count() + 1);
                    formField.setSingleAppointmentResultEntity(entity);

                    formFieldRepository.save(formField);
                }
                

            }
            else {
                List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldList.get(i).getFormFields());
                List<FormField> newListEntries = newList.get(i).getFormFields();
            
                for (int j = 0; j < newListEntries.size(); j++) {
                    updateFormField(newListEntries.get(j), oldEntriesList.get(j));
                }    
                // updateShoppingCartResult(newList.get(i), oldList.get(i));
            }
        }
    }

}

