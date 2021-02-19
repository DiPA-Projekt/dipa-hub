package online.dipa.hub.convert;

import online.dipa.hub.api.model.ContactPersonResult;
import online.dipa.hub.persistence.entities.ContactPersonResultEntity;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class ContactPersonResultEntityToContactPersonResultConverter implements Converter<ContactPersonResultEntity, ContactPersonResult> {
    @Override
    public ContactPersonResult convert(final ContactPersonResultEntity entity) {

        ContactPersonResult contactPersonResult = new ContactPersonResult()
                                                    .name(entity.getName())
                                                    .department(entity.getDepartment())
                                                    .taskArea(entity.getTaskArea());

        return (ContactPersonResult) contactPersonResult.resultType(String.valueOf(entity.getResultType()));

    }
}
