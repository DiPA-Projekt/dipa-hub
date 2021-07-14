package online.dipa.hub.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.PermanentProjectTask;
import online.dipa.hub.persistence.entities.PermanentProjectTaskEntity;

@Component
public class PermanentProjectTaskEntityToPermanentProjectTaskConverter implements Converter<PermanentProjectTaskEntity, PermanentProjectTask> {

    @Autowired
    private ProjectTaskEntityToProjectTaskConverter projectTaskConverter;

    @Override
    public PermanentProjectTask convert(final PermanentProjectTaskEntity template) {

        return new PermanentProjectTask().id(template.getId())
                                         .title(template.getTitle())
                                         .icon(template.getIcon())
                                         .sortOrder(template.getSortOrder())
                                         .projectTask(projectTaskConverter.convert(template.getProjectTask()));
    }
}
