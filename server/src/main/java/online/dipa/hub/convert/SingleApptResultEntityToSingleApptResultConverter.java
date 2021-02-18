package online.dipa.hub.convert;

import online.dipa.hub.api.model.SingleAppointmentResult;
import online.dipa.hub.persistence.entities.SingleAppointmentResultEntity;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class SingleApptResultEntityToSingleApptResultConverter implements Converter<SingleAppointmentResultEntity, SingleAppointmentResult> {
    @Override
    public SingleAppointmentResult convert(final SingleAppointmentResultEntity entity) {

        SingleAppointmentResult singleAppointmentResult = new SingleAppointmentResult()
                                                            .date(entity.getDate())
                                                            .goal(entity.getGoal())
                                                            .responsiblePerson(entity.getResponsiblePerson());
        return (SingleAppointmentResult) singleAppointmentResult.resultTypeId(String.valueOf(entity.getResultTypeId()));
    }
}
