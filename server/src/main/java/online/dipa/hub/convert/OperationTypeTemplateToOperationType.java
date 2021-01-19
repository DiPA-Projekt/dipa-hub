package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.OperationType;
import online.dipa.hub.persistence.entities.OperationTypeEntity;

@Component
public class OperationTypeTemplateToOperationType implements Converter<OperationTypeEntity, OperationType> {
    @Override
    public OperationType convert(final OperationTypeEntity templateEntity) {
        return new OperationType().id(templateEntity.getId())
                                .name(templateEntity.getName());
    }
}
