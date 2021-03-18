package online.dipa.hub.mapper;

import org.mapstruct.*;

import online.dipa.hub.api.model.ContactPersonResult;
import online.dipa.hub.persistence.entities.ContactPersonResultEntity;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ContactPersonResultMapper {

//    @BeforeMapping
//    default void setContactPersonResultStatus(ContactPersonResult contactPersonResult, @MappingTarget ContactPersonResultEntity contactPersonResultEntity) {
//        if (contactPersonResult.getStatus() != null) {
//            contactPersonResultEntity.setStatus(contactPersonResult.getStatus().toString());
//        }
//    }

    ContactPersonResultEntity toContactPersonResultEntity(ContactPersonResult contactPersonResult);

    @InheritConfiguration
    void updateContactPersonResult(ContactPersonResult contactPersonResult, @MappingTarget ContactPersonResultEntity contactPersonResultEntity);
    
}

