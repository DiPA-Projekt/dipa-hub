package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.persistence.entities.ProjectTypeEntity;

@Component
public class ProjektTypeToTimelineConverter implements Converter<ProjectTypeEntity, Timeline> {
	@Override
	public Timeline convert(final ProjectTypeEntity projectTypeEntity) {
		return new Timeline().id(projectTypeEntity.getId())
							 .name(projectTypeEntity.getName())
							 .defaultTimeline(projectTypeEntity.isDefaultType());
	}
}
