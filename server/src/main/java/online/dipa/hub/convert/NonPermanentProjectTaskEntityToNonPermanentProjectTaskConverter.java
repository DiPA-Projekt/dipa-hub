package online.dipa.hub.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.NonPermanentProjectTask;
import online.dipa.hub.persistence.entities.NonPermanentProjectTaskEntity;

@Component
public class NonPermanentProjectTaskEntityToNonPermanentProjectTaskConverter implements Converter<NonPermanentProjectTaskEntity, NonPermanentProjectTask> {

    @Autowired
    private ProjectTaskEntityToProjectTaskConverter projectTaskConverter;

    @Override
    public NonPermanentProjectTask convert(final NonPermanentProjectTaskEntity template) {

        return new NonPermanentProjectTask().id(template.getId())
                                         .title(template.getTitle())
                                         .icon(template.getIcon())
                                         .sortOrder(template.getSortOrder())
                                         .projectTask(projectTaskConverter.convert(template.getProjectTask()));
    }
}
