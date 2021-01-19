package online.dipa.hub.convert;


import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.Template;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PlanTemplateToTemplateConverter implements Converter<PlanTemplateEntity, Template> {
    @Override
    public Template convert(final PlanTemplateEntity templateEntity) {
      

        return new Template().id(templateEntity.getId())
                            .name(templateEntity.getName());
    }
}
