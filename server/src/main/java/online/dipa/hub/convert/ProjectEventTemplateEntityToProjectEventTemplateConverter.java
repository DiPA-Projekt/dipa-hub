package online.dipa.hub.convert;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.ProjectEvent;
import online.dipa.hub.api.model.ProjectEventTemplate;
import online.dipa.hub.persistence.entities.ProjectEventTemplateEntity;

@Component
public class ProjectEventTemplateEntityToProjectEventTemplateConverter implements Converter<ProjectEventTemplateEntity, ProjectEventTemplate> {
    @Autowired
    private ProjectEventEntityToProjectEventConverter eventConverter;

    @Override
    public ProjectEventTemplate convert(final ProjectEventTemplateEntity entity) {
        List<ProjectEvent> events = entity.getProjectEvents().stream()
                                   .map(p -> eventConverter.convert(p))
                                   .sorted(Comparator.comparing(event -> event != null ? event.getDateTime() : null))
                                   .collect(
                Collectors.toList());

        return new ProjectEventTemplate().id(entity.getId())
                          .title(entity.getTitle())
                          .eventType(ProjectEventTemplate.EventTypeEnum.valueOf(entity.getEventType()))
                          .events(events);
    }
}
