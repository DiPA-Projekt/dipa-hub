package online.dipa.hub.convert;

import java.time.LocalDate;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;

@Component
public class MilestoneTemplateToMilestoneConverter implements Converter<MilestoneTemplateEntity, Milestone> {
    @Override
    public Milestone convert(final MilestoneTemplateEntity templateEntity) {
        final Milestone milestone = new Milestone().id(templateEntity.getId())
                                                   .name(templateEntity.getName())
                                                   .date(LocalDate.now()
                                                                  .plusDays(templateEntity.getDateOffset()));
        switch (templateEntity.getStatus()) {
        case "offen":
            milestone.status(Milestone.StatusEnum.OFFEN);
            break;
        case "erledigt":
            milestone.status(Milestone.StatusEnum.ERLEDIGT);
            break;
        }

        return milestone;
    }
}

