package online.dipa.hub.convert;

import online.dipa.hub.api.model.RiskResult;
import online.dipa.hub.api.model.RiskResult.StatusEnum;
import online.dipa.hub.persistence.entities.RiskResultEntity;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class RiskResultEntityToRiskResultConverter implements Converter<RiskResultEntity, RiskResult> {
    @Override
    public RiskResult convert(final RiskResultEntity entity) {

        RiskResult riskResult =  new RiskResult()
                                    .description(entity.getDescription())
                                    .solution(entity.getSolution())
                                    .value(entity.getValue());

        if (entity.getStatus() != null) {
            riskResult.status(StatusEnum.fromValue(entity.getStatus()));
        }

        return (RiskResult) riskResult.resultType(String.valueOf(entity.getResultType()));
    }
}
