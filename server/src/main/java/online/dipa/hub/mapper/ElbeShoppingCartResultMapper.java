package online.dipa.hub.mapper;

import org.mapstruct.*;

import online.dipa.hub.api.model.ELBEshoppingCartResult;
import online.dipa.hub.persistence.entities.ELBEShoppingCartResultEntity;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ElbeShoppingCartResultMapper {

    @BeforeMapping
    default void setShoppingCartResultStatus(ELBEshoppingCartResult shoppingCartResult, @MappingTarget ELBEShoppingCartResultEntity shoppingCartResultEntity) {
        if (shoppingCartResult.getStatus() != null) {
            shoppingCartResultEntity.setStatus(shoppingCartResult.getStatus().toString());
        }
        
    }

    ELBEShoppingCartResultEntity toEnity(ELBEshoppingCartResult shoppingCartResult);
    
    @InheritConfiguration
    void updateShoppingCartResult(ELBEshoppingCartResult shoppingCartResult, @MappingTarget ELBEShoppingCartResultEntity shoppingCartResultEntity);


}

