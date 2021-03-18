package online.dipa.hub.mapper;

import online.dipa.hub.api.model.FormField;
import online.dipa.hub.persistence.entities.FormFieldEntity;
import org.mapstruct.*;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface FormFieldMapper {

//    @BeforeMapping
//    default void setformFieldStatus(FormField formField, @MappingTarget FormFieldEntity formFieldEntity) {
//        if (formField.getStatus() != null) {
//            FormFieldEntity.setStatus(formField.getStatus().toString());
//        }
//
//    }

    FormFieldEntity toFormFieldEntity(FormField formField);
    
    @InheritConfiguration
    void updateFormField(FormField formField, @MappingTarget FormFieldEntity formFieldEntity);

}

