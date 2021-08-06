package online.dipa.hub.convert;

import java.util.TimeZone;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Event;
import online.dipa.hub.persistence.entities.EventEntity;

@Component
public class EventEntityToEventConverter implements Converter<EventEntity, Event> {
    @Override
    public Event convert(final EventEntity entity) {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

        Event event =  new Event().id(entity.getId())
                          .title(entity.getTitle())
                          .dateTime(entity.getDateTime())
                          .duration(entity.getDuration());

        if (entity.getStatus() != null) {
            event.status(Event.StatusEnum.fromValue(entity.getStatus()));
        }

        return event;
    }
}
