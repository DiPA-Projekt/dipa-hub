package online.dipa.hub.convert;

import online.dipa.hub.api.model.ContactPersonResult;
import online.dipa.hub.api.model.ExternalLink;
import online.dipa.hub.persistence.entities.ContactPersonResultEntity;
import online.dipa.hub.persistence.entities.ExternalLinkEntity;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class ContactPersonResultEntityToContactPersonResultConverter implements Converter<ContactPersonResultEntity, ContactPersonResult> {
    @Override
    public ContactPersonResult convert(final ContactPersonResultEntity entity) {
        System.out.println(entity.getName());

        return new ContactPersonResult()
                .name(entity.getName())
                .deparment(entity.getDepartment())
                .taskArea(entity.getTaskAre());
                // .status(entity.getStatus());
    }
}
