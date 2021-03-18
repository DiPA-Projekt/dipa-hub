package online.dipa.hub.convert;

import online.dipa.hub.api.model.ContactPersonResult;
import online.dipa.hub.api.model.FormField;
import online.dipa.hub.persistence.entities.ContactPersonResultEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ContactPersonResultEntityToContactPersonResultConverter implements Converter<ContactPersonResultEntity, ContactPersonResult> {

    @Autowired
    private FormFieldEntityToFormFieldConverter formFieldEntityToFormFieldConverter;

    @Override
    public ContactPersonResult convert(final ContactPersonResultEntity entity) {

        ContactPersonResult contactPersonResult = new ContactPersonResult();

        List<FormField> formFields = entity.getFormFields().stream().map(p -> formFieldEntityToFormFieldConverter.convert(p)).collect(Collectors.toList());
        contactPersonResult.formFields(formFields);

        return (ContactPersonResult) contactPersonResult.resultType(String.valueOf(entity.getResultType()));
    }
}
