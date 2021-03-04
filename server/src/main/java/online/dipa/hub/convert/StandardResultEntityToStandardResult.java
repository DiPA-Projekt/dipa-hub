package online.dipa.hub.convert;

import online.dipa.hub.api.model.StandardResult;
import online.dipa.hub.api.model.StandardResult.StatusEnum;
import online.dipa.hub.persistence.entities.StandardResultEntity;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;


@Component
public class StandardResultEntityToStandardResult implements Converter<StandardResultEntity, StandardResult> {
    @Override
    public StandardResult convert(final StandardResultEntity entity) {

        StandardResult standardResult = new StandardResult().result(entity.getContent());
        
        if (entity.getStatus() != null) {
            standardResult.status(StatusEnum.fromValue(entity.getStatus()));
        }
        
        return (StandardResult) standardResult.resultType(String.valueOf(entity.getResultType()));
    }
}
