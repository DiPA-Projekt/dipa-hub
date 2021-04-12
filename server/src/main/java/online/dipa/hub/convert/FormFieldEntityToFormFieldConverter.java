package online.dipa.hub.convert;

import online.dipa.hub.api.model.FormField;
import online.dipa.hub.api.model.OptionEntry;
import online.dipa.hub.persistence.entities.FormFieldEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FormFieldEntityToFormFieldConverter implements Converter<FormFieldEntity, FormField> {

    @Autowired
    private OptionEntryEntityToOptionEntryConverter optionEntryEntityToOptionEntryConverter;

    @Override
    public FormField convert(final FormFieldEntity entity) {

        FormField formfield = new FormField()
                .id(entity.getId())
                .value(entity.getValue())
                .key(entity.getKey())
                .label(entity.getLabel())
                .placeholder(entity.getPlaceholder())
                .required(entity.isRequired())
                .sortOrder(entity.getSortOrder())
                .show(entity.isShow());

        if (entity.getType() != null) {
            formfield.type(FormField.TypeEnum.fromValue(entity.getType()));
        }
        if (entity.getControlType() != null) {
            formfield.controlType(FormField.ControlTypeEnum.fromValue(entity.getControlType()));
        }
        if (entity.getOptions() != null) {
            List<OptionEntry> optionEntries = entity.getOptions().stream().map(p -> optionEntryEntityToOptionEntryConverter.convert(p)).collect(Collectors.toList());
            formfield.options(optionEntries);
        }

        return formfield;
    }
}
