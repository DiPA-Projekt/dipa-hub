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
        extends StandardResultMapper, ElbeShoppingCartResultMapper, ContactPersonResultMapper,
        SingleApptResultMapper, ApptSeriesResultMapper, RiskResultMapper, FormFieldMapper {


    void updateProjectTaskEntity(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity,@Context ElbeShoppingCartResultRepository elbeShoppingCartResultRepository,
    @Context RiskResultRepository riskResultRepository, @Context ContactPersonResultRepository contactPersonResultRepository,
    @Context SingleAppointmentResultRepository singleApptResultRepository, @Context AppointmentSeriesResultRepository apptSeriesResultRepository);

    void updateFormFieldEntity(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity,@Context FormFieldRepository formFieldRepository);

    @AfterMapping
    default void setFormFields(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity,@Context FormFieldRepository formFieldRepository) {
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
    }

    @AfterMapping
	default void setResults(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity, @Context ElbeShoppingCartResultRepository elbeShoppingCartResultRepository,
    @Context RiskResultRepository riskResultRepository, @Context ContactPersonResultRepository contactPersonResultRepository,
    @Context SingleAppointmentResultRepository singleApptResultRepository, @Context AppointmentSeriesResultRepository apptSeriesResultRepository){

        String resultType = projectTask.getResults().getType();

        switch (resultType) {
            case "TYPE_STD":
                updateStandardResults(projectTaskEntity, projectTask);
                break;
            case "TYPE_ELBE_SC":
                updateShoppingCartResults(projectTaskEntity, projectTask, elbeShoppingCartResultRepository);
                break;
            case "TYPE_CONTACT_PERS":
                updateContactPersonResults(projectTaskEntity, projectTask, contactPersonResultRepository);
                break;
            case "TYPE_APPT_SERIES":
                updateApptSeriesResults(projectTaskEntity, projectTask, apptSeriesResultRepository);
                break;
            case "TYPE_RISK":
                updateRiskResults(projectTaskEntity, projectTask, riskResultRepository);
                break;
            case "TYPE_SINGLE_APPOINTMENT":
                updateSingleApptResults(projectTaskEntity, projectTask, singleApptResultRepository);
                break;
        }
    }

    default void updateStandardResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask) {
        List<StandardResultEntity> oldList = new ArrayList<>(projectTaskEntity.getStandardResult());
        List<StandardResult> newList = projectTask.getResults().getData().stream().map(StandardResult.class::cast).collect(Collectors.toList());

//        for (int i = 0; i < newList.size(); i++) {
//            updateStandardResult(newList.get(i), oldList.get(i));
//        }
    }
    

    default void updateShoppingCartResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, ElbeShoppingCartResultRepository elbeShoppingCartResultRepository) {
            
        List<ELBEShoppingCartResultEntity> oldList = new ArrayList<>(projectTaskEntity.getELBEShoppingCartResults());
        List<ELBEshoppingCartResult> newList = projectTask.getResults().getData().stream().map(ELBEshoppingCartResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {
                
                ELBEShoppingCartResultEntity entity = toELBEShoppingCartResultEntity(newList.get(i));
                entity.setId(elbeShoppingCartResultRepository.count() + 1);
                entity.setProjectTask(projectTaskEntity);

                elbeShoppingCartResultRepository.save(entity);

            }
            else {
                updateShoppingCartResult(newList.get(i), oldList.get(i));
            }

        }
    }

    default void updateContactPersonResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, ContactPersonResultRepository contactPersonResultRepository) {
        
        List<ContactPersonResultEntity> oldList = new ArrayList<>(projectTaskEntity.getContactPersonResult());
        List<ContactPersonResult> newList = projectTask.getResults().getData().stream().map(ContactPersonResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {
                
                ContactPersonResultEntity entity = toContactPersonResultEntity(newList.get(i));
                entity.setId(contactPersonResultRepository.count() + 1);
                entity.setProjectTask(projectTaskEntity);

                contactPersonResultRepository.save(entity);

            }
            else {
                updateContactPersonResult(newList.get(i), oldList.get(i));
            }

        }
    }

    default void updateApptSeriesResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, AppointmentSeriesResultRepository apptSeriesResultRepository) {
        
        List<AppointmentSeriesResultEntity> oldList = new ArrayList<>(projectTaskEntity.getAppointmentSeriesResults());
        List<AppointmentSeriesResult> newList = projectTask.getResults().getData().stream().map(AppointmentSeriesResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() -1) {

                AppointmentSeriesResultEntity entity = toAppointmentSeriesResultEntity(newList.get(i));
                entity.setId(apptSeriesResultRepository.count() + 1);
                entity.setProjectTask(projectTaskEntity);
                apptSeriesResultRepository.save(entity);

            }
            else {
                updateApptSeriesResult(newList.get(i), oldList.get(i));
            }

        }
    }

    default void updateRiskResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, RiskResultRepository riskResultRepository) {
        
        List<RiskResultEntity> oldList = new ArrayList<>(projectTaskEntity.getRiskResults());
        List<RiskResult> newList = projectTask.getResults().getData().stream().map(RiskResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() -1) {

                RiskResultEntity entity = toRiskResultEntity(newList.get(i));
                entity.setId(riskResultRepository.count() + 1);
                entity.setProjectTask(projectTaskEntity);
                riskResultRepository.save(entity);

            }
            else {
                updateRiskResult(newList.get(i), oldList.get(i));
            }
        }
    }

    default void updateSingleApptResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, SingleAppointmentResultRepository singleApptResultRepository) {
        
        List<SingleAppointmentResultEntity> oldList = new ArrayList<>(projectTaskEntity.getSingleAppointmentResults());
        List<SingleAppointmentResult> newList = projectTask.getResults().getData().stream().map(SingleAppointmentResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() -1) {

                SingleAppointmentResultEntity entity = toSingleAppointmentResultEntity(newList.get(i));
                entity.setId(singleApptResultRepository.count() + 1);
                entity.setProjectTask(projectTaskEntity);
                singleApptResultRepository.save(entity);

            }
            else {
                updateSingleApptResult(newList.get(i), oldList.get(i));
            }

        }
    }

}

