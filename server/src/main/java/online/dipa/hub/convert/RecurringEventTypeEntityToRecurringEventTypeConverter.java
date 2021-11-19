package online.dipa.hub.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.RecurringEventType;
import online.dipa.hub.persistence.entities.ProjectPropertyQuestionEntity;
import online.dipa.hub.persistence.entities.RecurringEventTypeEntity;

@Component
public class RecurringEventTypeEntityToRecurringEventTypeConverter implements Converter<RecurringEventTypeEntity, RecurringEventType> {

    @Autowired
    protected RecurringEventPatternEntityToRecurringEventPatternConverter recurringEventPatternEntityToRecurringEventPatternConverter;

    @Override
    public RecurringEventType convert(final RecurringEventTypeEntity templateEntity) {

        RecurringEventType recurringEventType = new RecurringEventType().id(templateEntity.getId())
                            .mandatory(templateEntity.isMandatory())
                            .title(templateEntity.getTitle())
                            .description(templateEntity.getDescription())
                            .published(templateEntity.isPublished())
                            .recurringEventPattern(recurringEventPatternEntityToRecurringEventPatternConverter
                                    .convert(templateEntity.getRecurringEventPattern()));

        ProjectPropertyQuestionEntity projectPropertyQuestionEntity = templateEntity.getProjectPropertyQuestion();

        if (projectPropertyQuestionEntity != null) {
            recurringEventType.projectPropertyQuestionId(projectPropertyQuestionEntity.getId());
        }

        RecurringEventTypeEntity masterRecurringEventTypeEntity = templateEntity.getMasterRecurringEventType();

        if (masterRecurringEventTypeEntity != null) {
            recurringEventType.masterRecurringEventTypeId(masterRecurringEventTypeEntity.getId());
        }

        return recurringEventType;
    }
}
