package online.dipa.hub.convert;

import online.dipa.hub.api.model.AppointmentSeriesResult;
import online.dipa.hub.api.model.FormField;
import online.dipa.hub.persistence.entities.AppointmentSeriesResultEntity;
import online.dipa.hub.persistence.entities.FormFieldEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ApptSeriesResultEntityToApptSeriesResultConverter implements Converter<AppointmentSeriesResultEntity, AppointmentSeriesResult> {

    @Autowired
    private FormFieldEntityToFormFieldConverter formFieldEntityToFormFieldConverter;

    @Override
    public AppointmentSeriesResult convert(final AppointmentSeriesResultEntity entity) {

        AppointmentSeriesResult appointmentSeriesResult =  new AppointmentSeriesResult();

        List<FormField> formFields = entity.getFormFields().stream().map(p -> formFieldEntityToFormFieldConverter.convert(p)).collect(Collectors.toList());
        appointmentSeriesResult.formFields(formFields);

        return (AppointmentSeriesResult) appointmentSeriesResult.resultType(String.valueOf(entity.getResultType()));
    }
}
