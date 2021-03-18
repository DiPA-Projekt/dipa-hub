package online.dipa.hub.convert;

import online.dipa.hub.api.model.FormField;
import online.dipa.hub.api.model.StandardResult;
import online.dipa.hub.persistence.entities.StandardResultEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;


@Component
public class StandardResultEntityToStandardResult implements Converter<StandardResultEntity, StandardResult> {

    @Autowired
    private FormFieldEntityToFormFieldConverter formFieldEntityToFormFieldConverter;

    @Override
    public StandardResult convert(final StandardResultEntity entity) {

        StandardResult standardResult = new StandardResult();

       List<FormField> formFields = entity.getFormFields().stream().map(p -> formFieldEntityToFormFieldConverter.convert(p)).collect(Collectors.toList());
        standardResult.formFields(formFields);

        System.out.println(entity.getFormFields());

        return (StandardResult) standardResult.resultType(String.valueOf(entity.getResultType()));
    }
}
