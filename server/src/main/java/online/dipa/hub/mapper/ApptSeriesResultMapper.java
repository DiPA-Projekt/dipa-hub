package online.dipa.hub.mapper;

import org.mapstruct.*;

import online.dipa.hub.api.model.AppointmentSeriesResult;
import online.dipa.hub.persistence.entities.AppointmentSeriesResultEntity;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ApptSeriesResultMapper {

    @BeforeMapping
    default void setApptSeriesResultStatus(AppointmentSeriesResult apptSeriesResult, @MappingTarget AppointmentSeriesResultEntity apptSeriesResultEntity) {
        if (apptSeriesResult.getStatus() != null) {
            apptSeriesResultEntity.setStatus(apptSeriesResult.getStatus().toString());

        }
    }
        
    AppointmentSeriesResultEntity toEnity(AppointmentSeriesResult apptSeriesResult);

    @InheritConfiguration
    void updateApptSeriesResult(AppointmentSeriesResult apptSeriesResult, @MappingTarget AppointmentSeriesResultEntity apptSeriesResultEntity);


}

