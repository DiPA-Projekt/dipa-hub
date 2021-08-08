package online.dipa.hub.convert;

import java.util.TimeZone;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.ProjectEvent;
import online.dipa.hub.persistence.entities.ProjectEventEntity;

@Component
public class ProjectEventEntityToProjectEventConverter implements Converter<ProjectEventEntity, ProjectEvent> {
    @Override
    public ProjectEvent convert(final ProjectEventEntity entity) {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

        ProjectEvent event =  new ProjectEvent().id(entity.getId())
                          .title(entity.getTitle())
                          .dateTime(entity.getDateTime())
                          .duration(entity.getDuration());

        if (entity.getStatus() != null) {
            event.status(ProjectEvent.StatusEnum.fromValue(entity.getStatus()));
        }

        return event;
    }
}
