package online.dipa.hub.convert;

import online.dipa.hub.api.model.OptionEntry;
import online.dipa.hub.persistence.entities.OptionEntryEntity;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class OptionEntryEntityToOptionEntryConverter implements Converter<OptionEntryEntity, OptionEntry> {
    @Override
    public OptionEntry convert(final OptionEntryEntity entity) {

        return new OptionEntry().key(entity.getKey())
                .value(entity.getValue());
    }
}
