package online.dipa.hub.convert;

import online.dipa.hub.api.model.AppointmentSeriesResult;
import online.dipa.hub.persistence.entities.AppointmentSeriesResultEntity;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class ApptSeriesResultEntityToApptSeriesResultConverter implements Converter<AppointmentSeriesResultEntity, AppointmentSeriesResult> {
    @Override
    public AppointmentSeriesResult convert(final AppointmentSeriesResultEntity entity) {

        AppointmentSeriesResult appointmentSeriesResult =  new AppointmentSeriesResult()
                                                            .appointment(entity.getAppointment())
                                                            .link(entity.getLink())
                                                            .participants(entity.getParticipants());


        return (AppointmentSeriesResult) appointmentSeriesResult.resultTypeId(String.valueOf(entity.getResultTypeId()));

    }
}
