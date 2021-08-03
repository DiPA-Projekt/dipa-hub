package online.dipa.hub.convert;

import java.util.Comparator;
import java.util.List;
import java.util.TimeZone;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Event;
import online.dipa.hub.api.model.EventTemplate;
import online.dipa.hub.persistence.entities.EventTemplateEntity;

@Component
public class EventTemplateEntityToEventTemplateConverter implements Converter<EventTemplateEntity, EventTemplate> {
    @Autowired
    private EventEntityToEventConverter eventConverter;

    @Override
    public EventTemplate convert(final EventTemplateEntity entity) {
        List<Event> events = entity.getEvents().stream()
                                   .map(p -> eventConverter.convert(p))
                                   .sorted(Comparator.comparing(event -> event != null ? event.getDateTime() : null))
                                   .collect(
                Collectors.toList());

        return new EventTemplate().id(entity.getId())
                          .title(entity.getTitle())
                          .eventType(EventTemplate.EventTypeEnum.valueOf(entity.getEventType()))
                          .events(events);
    }
}
