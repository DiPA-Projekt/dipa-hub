package online.dipa.hub.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.*;
import online.dipa.hub.api.model.*;
import online.dipa.hub.persistence.entities.*;

import online.dipa.hub.persistence.repositories.*;


@Mapper(componentModel = "spring")
public interface ProjectTaskProjectTaskEntityMapper 
        extends StandardResultMapper, ElbeShoppingCartResultMapper, ContactPersonResultMapper,
        SingleApptResultMapper, ApptSeriesResultMapper, RiskResultMapper {

    // final StandardResultMapper standardResultMapper = Mappers.getMapper(StandardResultMapper.class);
    // final ElbeShoppingCartResultMapper elbeShoppingCartResultMapper = Mappers.getMapper(ElbeShoppingCartResultMapper.class);
    // final ContactPersonResultMapper contactPersonResultMapper = Mappers.getMapper(ContactPersonResultMapper.class);
    // final SingleApptResultMapper singleApptResultMapper = Mappers.getMapper(SingleApptResultMapper.class);
    // final ApptSeriesResultMapper apptSeriesResultMapper = Mappers.getMapper(ApptSeriesResultMapper.class);
    // final RiskResultMapper riskResultMapper = Mappers.getMapper(RiskResultMapper.class);


    void updateProjectTaskEntity(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity,@Context ElbeShoppingCartResultRepository elbeShoppingCartResultRepository,
    @Context RiskResultRepository riskResultRepository, @Context ContactPersonResultRepository contactPersonResultRepository,
    @Context SingleAppointmentResultRepository singleApptResultRepository, @Context AppointmentSeriesResultRepository apptSeriesResultRepository);


    @AfterMapping
	default void setResults(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity, @Context ElbeShoppingCartResultRepository elbeShoppingCartResultRepository,
    @Context RiskResultRepository riskResultRepository, @Context ContactPersonResultRepository contactPersonResultRepository,
    @Context SingleAppointmentResultRepository singleApptResultRepository, @Context AppointmentSeriesResultRepository apptSeriesResultRepository){

        String resultType = projectTask.getResults().getType();

        if (resultType.equals("TYPE_STD")) {
            updateStandardResults(projectTaskEntity, projectTask);

        }
        else if (resultType.equals("TYPE_ELBE_SC")) {
            
            updateShoppingCartResults(projectTaskEntity, projectTask, elbeShoppingCartResultRepository);

        }
        else if (resultType.equals("TYPE_CONTACT_PERS")) {

            updateContactPersonResults(projectTaskEntity, projectTask, contactPersonResultRepository);
        }
        else if (resultType.equals("TYPE_APPT_SERIES")) {
            
            updateApptSeriesResults(projectTaskEntity, projectTask, apptSeriesResultRepository);
            
        }
        else if (resultType.equals("TYPE_RISK")) {

            updateRiskResults(projectTaskEntity, projectTask, riskResultRepository);
            
        }
        else if (resultType.equals("TYPE_SINGLE_APPOINTMENT")) {
            
            updateSingleApptResults(projectTaskEntity, projectTask, singleApptResultRepository);
        }
    }

    default void updateStandardResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask) {
        List<StandardResultEntity> oldList = projectTaskEntity.getStandardResult().stream().collect(Collectors.toList());
        List<StandardResult> newList = projectTask.getResults().getData().stream().map(StandardResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {
            updateStandardResult(newList.get(i), oldList.get(i));
        }
    }
    

    default void updateShoppingCartResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, ElbeShoppingCartResultRepository elbeShoppingCartResultRepository) {
            
        List<ELBEShoppingCartResultEntity> oldList = projectTaskEntity.getELBEShoppingCartResults().stream().collect(Collectors.toList());
        List<ELBEshoppingCartResult> newList = projectTask.getResults().getData().stream().map(ELBEshoppingCartResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {
                
                ELBEShoppingCartResultEntity entity = toELBEShoppingCartResultEntity(newList.get(i));
                entity.setId(Long.valueOf(elbeShoppingCartResultRepository.count() + 1));
                entity.setProjectTask(projectTaskEntity);

                elbeShoppingCartResultRepository.save(entity);

            }
            else {
                updateShoppingCartResult(newList.get(i), oldList.get(i));
            }

        }
    }

    default void updateContactPersonResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, ContactPersonResultRepository contactPersonResultRepository) {
        
        List<ContactPersonResultEntity> oldList = projectTaskEntity.getContactPersonResult().stream().collect(Collectors.toList());
        List<ContactPersonResult> newList = projectTask.getResults().getData().stream().map(ContactPersonResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {
                
                ContactPersonResultEntity entity = toContactPersonResultEntity(newList.get(i));
                entity.setId(Long.valueOf(contactPersonResultRepository.count() + 1));
                entity.setProjectTask(projectTaskEntity);

                contactPersonResultRepository.save(entity);

            }
            else {
                updateContactPersonResult(newList.get(i), oldList.get(i));
            }

        }
    }

    default void updateApptSeriesResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, AppointmentSeriesResultRepository apptSeriesResultRepository) {
        
        List<AppointmentSeriesResultEntity> oldList = projectTaskEntity.getAppointmentSeriesResults().stream().collect(Collectors.toList());
        List<AppointmentSeriesResult> newList = projectTask.getResults().getData().stream().map(AppointmentSeriesResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() -1) {

                AppointmentSeriesResultEntity entity = toAppointmentSeriesResultEntity(newList.get(i));
                entity.setId(Long.valueOf(apptSeriesResultRepository.count() + 1));
                entity.setProjectTask(projectTaskEntity);
                apptSeriesResultRepository.save(entity);

            }
            else {
                updateApptSeriesResult(newList.get(i), oldList.get(i));
            }

        }
    }

    default void updateRiskResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, RiskResultRepository riskResultRepository) {
        
        List<RiskResultEntity> oldList = projectTaskEntity.getRiskResults().stream().collect(Collectors.toList());
        List<RiskResult> newList = projectTask.getResults().getData().stream().map(RiskResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() -1) {

                RiskResultEntity entity = toRiskResultEntity(newList.get(i));
                entity.setId(Long.valueOf(riskResultRepository.count() + 1));
                entity.setProjectTask(projectTaskEntity);
                riskResultRepository.save(entity);

            }
            else {
                updateRiskResult(newList.get(i), oldList.get(i));
            }
        }
    }

    default void updateSingleApptResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask, SingleAppointmentResultRepository singleApptResultRepository) {
        
        List<SingleAppointmentResultEntity> oldList = projectTaskEntity.getSingleAppointmentResults().stream().collect(Collectors.toList());
        List<SingleAppointmentResult> newList = projectTask.getResults().getData().stream().map(SingleAppointmentResult.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() -1) {

                SingleAppointmentResultEntity entity = toSingleAppointmentResultEntity(newList.get(i));
                entity.setId(Long.valueOf(singleApptResultRepository.count() + 1));
                entity.setProjectTask(projectTaskEntity);
                singleApptResultRepository.save(entity);

            }
            else {
                updateSingleApptResult(newList.get(i), oldList.get(i));
            }

        }
    }

}

