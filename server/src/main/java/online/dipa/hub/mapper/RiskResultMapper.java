package online.dipa.hub.mapper;

import org.mapstruct.*;

import online.dipa.hub.api.model.RiskResult;
import online.dipa.hub.persistence.entities.RiskResultEntity;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RiskResultMapper {

    @BeforeMapping
    default void setRiskResultStatus(RiskResult riskResult, @MappingTarget RiskResultEntity riskResultEntity) {
        if (riskResult.getStatus() != null) {
            riskResultEntity.setStatus(riskResult.getStatus().toString());
        }
    }

    RiskResultEntity toEntity(RiskResult riskResult);
    
    @InheritConfiguration
    void updateRiskResult(RiskResult riskResult, @MappingTarget RiskResultEntity riskResultEntity);


}

