package online.dipa.hub.convert;

import online.dipa.hub.api.model.FormField;
import online.dipa.hub.api.model.SingleAppointmentResult;
import online.dipa.hub.persistence.entities.SingleAppointmentResultEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SingleApptResultEntityToSingleApptResultConverter implements Converter<SingleAppointmentResultEntity, SingleAppointmentResult> {

    @Autowired
    private FormFieldEntityToFormFieldConverter formFieldEntityToFormFieldConverter;

    @Override
    public SingleAppointmentResult convert(final SingleAppointmentResultEntity entity) {
        SingleAppointmentResult singleAppointmentResult = new SingleAppointmentResult();

        List<FormField> formFields = entity.getFormFields().stream().map(p -> formFieldEntityToFormFieldConverter.convert(p)).collect(Collectors.toList());
        singleAppointmentResult.formFields(formFields);

        return (SingleAppointmentResult) singleAppointmentResult.resultType(String.valueOf(entity.getResultType()));
    }
}
