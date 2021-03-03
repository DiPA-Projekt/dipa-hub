package online.dipa.hub.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import online.dipa.hub.api.model.*;
import online.dipa.hub.persistence.entities.*;

import online.dipa.hub.persistence.repositories.*;


@Mapper(componentModel = "spring", uses = {StandardResultMapper.class, ElbeShoppingCartResultMapper.class,
                                ContactPersonResultMapper.class, SingleApptResultMapper.class,
                                ApptSeriesResultMapper.class, RiskResultMapper.class})
public interface ProjectTaskProjectTaskEntityMapper {

    final StandardResultMapper standardResultMapper = Mappers.getMapper(StandardResultMapper.class);
    final ElbeShoppingCartResultMapper elbeShoppingCartResultMapper = Mappers.getMapper(ElbeShoppingCartResultMapper.class);
    final ContactPersonResultMapper contactPersonResultMapper = Mappers.getMapper(ContactPersonResultMapper.class);
    final SingleApptResultMapper singleApptResultMapper = Mappers.getMapper(SingleApptResultMapper.class);
    final ApptSeriesResultMapper apptSeriesResultMapper = Mappers.getMapper(ApptSeriesResultMapper.class);
    final RiskResultMapper riskResultMapper = Mappers.getMapper(RiskResultMapper.class);

    void updateProjectTaskEntity(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity,@Context ElbeShoppingCartResultRepository elbeShoppingCartResultRepository,
    @Context RiskResultRepository riskResultRepository, @Context ContactPersonResultRepository contactPersonResultRepository,
    @Context SingleAppointmentResultRepository singleApptResultRepository, @Context AppointmentSeriesResultRepository apptSeriesResultRepository);


    @AfterMapping
	default void setResults(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity, @Context ElbeShoppingCartResultRepository elbeShoppingCartResultRepository,
    @Context RiskResultRepository riskResultRepository, @Context ContactPersonResultRepository contactPersonResultRepository,
    @Context SingleAppointmentResultRepository singleApptResultRepository, @Context AppointmentSeriesResultRepository apptSeriesResultRepository){

        String resultType = projectTask.getResults().getType();

        if (resultType.equals("TYPE_STD")) {
            List<StandardResultEntity> oldList = projectTaskEntity.getStandardResult().stream().collect(Collectors.toList());
            List<StandardResult> newList = projectTask.getResults().getData().stream().map(res -> (StandardResult) res).collect(Collectors.toList());

            for (int i = 0; i < newList.size(); i++) {
                standardResultMapper.updateStandardResult(newList.get(i), oldList.get(i));
            }

        }
        else if (resultType.equals("TYPE_ELBE_SC")) {
            List<ELBEShoppingCartResultEntity> oldList = projectTaskEntity.getELBEShoppingCartResults().stream().collect(Collectors.toList());
            List<ELBEshoppingCartResult> newList = projectTask.getResults().getData().stream().map(res -> (ELBEshoppingCartResult) res).collect(Collectors.toList());

            for (int i = 0; i < newList.size(); i++) {

                if (i > oldList.size() - 1) {

                    ELBEShoppingCartResultEntity entity = elbeShoppingCartResultMapper.toEnity(newList.get(i));
                    entity.setId(Long.valueOf(elbeShoppingCartResultRepository.count() + 1));
                    entity.setProjectTask(projectTaskEntity);
   
                    elbeShoppingCartResultRepository.save(entity);

                }
                else {
                    elbeShoppingCartResultMapper.updateShoppingCartResult(newList.get(i), oldList.get(i));
                }

            }

        }
        else if (resultType.equals("TYPE_CONTACT_PERS")) {
            List<ContactPersonResultEntity> oldList = projectTaskEntity.getContactPersonResult().stream().collect(Collectors.toList());
            List<ContactPersonResult> newList = projectTask.getResults().getData().stream().map(res -> (ContactPersonResult) res).collect(Collectors.toList());

            for (int i = 0; i < newList.size(); i++) {

                if (i > oldList.size() -1) {

                    ContactPersonResultEntity entity = contactPersonResultMapper.toEnity(newList.get(i));
                    entity.setId(Long.valueOf(contactPersonResultRepository.count() + 1));
                    entity.setProjectTask(projectTaskEntity);
                    contactPersonResultRepository.save(entity);

                }
                else {
                    contactPersonResultMapper.updateContactPersonResult(newList.get(i), oldList.get(i));
                }

            }
        }
        else if (resultType.equals("TYPE_APPT_SERIES")) {
            List<AppointmentSeriesResultEntity> oldList = projectTaskEntity.getAppointmentSeriesResults().stream().collect(Collectors.toList());
            List<AppointmentSeriesResult> newList = projectTask.getResults().getData().stream().map(res -> (AppointmentSeriesResult) res).collect(Collectors.toList());

            for (int i = 0; i < newList.size(); i++) {

                if (i > oldList.size() -1) {

                    AppointmentSeriesResultEntity entity = apptSeriesResultMapper.toEnity(newList.get(i));
                    entity.setId(Long.valueOf(apptSeriesResultRepository.count() + 1));
                    entity.setProjectTask(projectTaskEntity);
                    apptSeriesResultRepository.save(entity);

                }
                else {
                    apptSeriesResultMapper.updateApptSeriesResult(newList.get(i), oldList.get(i));
                }

            }

            
        }
        else if (resultType.equals("TYPE_RISK")) {
            List<RiskResultEntity> oldList = projectTaskEntity.getRiskResults().stream().collect(Collectors.toList());
            List<RiskResult> newList = projectTask.getResults().getData().stream().map(res -> (RiskResult) res).collect(Collectors.toList());

            for (int i = 0; i < newList.size(); i++) {

                if (i > oldList.size() -1) {

                    RiskResultEntity entity = riskResultMapper.toEnity(newList.get(i));
                    entity.setId(Long.valueOf(riskResultRepository.count() + 1));
                    entity.setProjectTask(projectTaskEntity);
                    riskResultRepository.save(entity);
   
                }
                else {
                    riskResultMapper.updateRiskResult(newList.get(i), oldList.get(i));
                }

            }

            
        }
        else if (resultType.equals("TYPE_SINGLE_APPOINTMENT")) {
            List<SingleAppointmentResultEntity> oldList = projectTaskEntity.getSingleAppointmentResults().stream().collect(Collectors.toList());
            List<SingleAppointmentResult> newList = projectTask.getResults().getData().stream().map(res -> (SingleAppointmentResult) res).collect(Collectors.toList());

            for (int i = 0; i < newList.size(); i++) {

                if (i > oldList.size() -1) {

                    SingleAppointmentResultEntity entity = singleApptResultMapper.toEnity(newList.get(i));
                    entity.setId(Long.valueOf(singleApptResultRepository.count() + 1));
                    entity.setProjectTask(projectTaskEntity);
                    singleApptResultRepository.save(entity);
   
                }
                else {
                    singleApptResultMapper.updateSingleApptResult(newList.get(i), oldList.get(i));
                }

            }

        }
    }

}

