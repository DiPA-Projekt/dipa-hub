package online.dipa.hub.mapper;

import online.dipa.hub.api.model.FormField;
import online.dipa.hub.persistence.entities.FormFieldEntity;

import org.mapstruct.*;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface FormFieldMapper {

    FormFieldEntity toFormFieldEntity(FormField formField);
    
    @InheritConfiguration
    void updateFormField(FormField formField, @MappingTarget FormFieldEntity formFieldEntity);

}

