package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.MilestoneTemplate;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;

@Component
public class MilestoneTemplateEntityToMilestoneTemplateConverter implements Converter<MilestoneTemplateEntity, MilestoneTemplate> {
    @Override
    public MilestoneTemplate convert(final MilestoneTemplateEntity templateEntity) {

        return new MilestoneTemplate().id(templateEntity.getId())
                            .name(templateEntity.getName())
                            .dateOffset(templateEntity.getDateOffset());
    }
}
