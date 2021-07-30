package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Event;
import online.dipa.hub.persistence.entities.EventEntity;

@Component
public class EventEntityToEventConverter implements Converter<EventEntity, Event> {
    @Override
    public Event convert(final EventEntity entity) {

        return new Event().id(entity.getId())
//                          .tit
                          .eventType(Event.EventTypeEnum.valueOf(entity.getEventType()))
                          .dateTime(entity.getDateTime())
                          .duration(entity.getDuration());
    }
}
