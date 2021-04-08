package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Increment;
import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.persistence.entities.IncrementEntity;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;

@Component
public class IncrementEntityToIncrementConverter implements Converter<IncrementEntity, Increment> {
    @Override
    public Increment convert(final IncrementEntity templateEntity) {

        return new Increment().id(templateEntity.getId())
                            .name(templateEntity.getName())
                            .start(templateEntity.getStartDate().toLocalDate())
                            .end(templateEntity.getEndDate().toLocalDate());
    }
}
