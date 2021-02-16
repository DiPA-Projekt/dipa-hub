package online.dipa.hub.convert;

import online.dipa.hub.api.model.ELBEshoppingCartResult;
import online.dipa.hub.persistence.entities.ELBEShoppingCartResultEntity;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class ElbeShoppingCartResultEntityToElbeShoppingCartResultConverter implements Converter<ELBEShoppingCartResultEntity, ELBEshoppingCartResult> {
    @Override
    public ELBEshoppingCartResult convert(final ELBEShoppingCartResultEntity entity) {

        return new ELBEshoppingCartResult()
                    .shoppingCartNumber(entity.getShoppingCartNumber())
                    .shoppingCartContent(entity.getShoppingCartContent());

    }
}
