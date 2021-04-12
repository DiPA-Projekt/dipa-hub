package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.OptionEntry;
import online.dipa.hub.persistence.entities.OptionEntryEntity;

@Component
public class OptionEntryToOptionEntryEntityConverter implements Converter<OptionEntry, OptionEntryEntity> {
    @Override
    public OptionEntryEntity convert(final OptionEntry optionEntry) {

        OptionEntryEntity optionEntryEntity = new OptionEntryEntity();
        optionEntryEntity.setKey(optionEntry.getKey());
        optionEntryEntity.setValue(optionEntry.getValue());

        return optionEntryEntity;
    }
}
