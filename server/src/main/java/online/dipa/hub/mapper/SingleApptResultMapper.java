package online.dipa.hub.mapper;

import org.mapstruct.*;
import online.dipa.hub.api.model.SingleAppointmentResult;
import online.dipa.hub.persistence.entities.SingleAppointmentResultEntity;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface SingleApptResultMapper {

//    @BeforeMapping
//    default void setSingleApptResult(SingleAppointmentResult singleApptResult, @MappingTarget SingleAppointmentResultEntity singleApptResultEntity) {
//        if (singleApptResult.getStatus() != null) {
//            singleApptResultEntity.setStatus(singleApptResult.getStatus().toString());
//        }
//    }

    SingleAppointmentResultEntity toSingleAppointmentResultEntity(SingleAppointmentResult singleApptResult);
    
    @InheritConfiguration
    void updateSingleApptResult(SingleAppointmentResult singleApptResult, @MappingTarget SingleAppointmentResultEntity singleApptResultEntity);

}

