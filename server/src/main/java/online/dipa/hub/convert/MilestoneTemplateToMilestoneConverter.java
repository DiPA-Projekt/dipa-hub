package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;

@Component
public class MilestoneTemplateToMilestoneConverter implements Converter<MilestoneTemplateEntity, Milestone> {
    @Override
    public Milestone convert(final MilestoneTemplateEntity templateEntity) {

        return new Milestone().id(templateEntity.getId())
                            .name(templateEntity.getName())
                            .date(templateEntity.getDate().toLocalDate())
                            .status(Milestone.StatusEnum.fromValue(templateEntity.getStatus()));
    }
}
