package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.RecurringEventPattern;
import online.dipa.hub.persistence.entities.RecurringEventPatternEntity;

@Component
public class RecurringEventPatternEntityToRecurringEventPatternConverter implements Converter<RecurringEventPatternEntity, RecurringEventPattern> {
    @Override
    public RecurringEventPattern convert(final RecurringEventPatternEntity templateEntity) {

        return new RecurringEventPattern().id(templateEntity.getId())
                                          .rulePattern(templateEntity.getRulePattern())
                                          .startDate(templateEntity.getStartDate())
                                          .endDate(templateEntity.getEndDate())
                                          .duration(templateEntity.getDuration());
    }
}
