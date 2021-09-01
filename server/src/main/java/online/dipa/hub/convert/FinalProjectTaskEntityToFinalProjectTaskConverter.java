package online.dipa.hub.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.FinalProjectTask;
import online.dipa.hub.persistence.entities.FinalProjectTaskEntity;

@Component
public class FinalProjectTaskEntityToFinalProjectTaskConverter implements Converter<FinalProjectTaskEntity, FinalProjectTask> {

    @Autowired
    private ProjectTaskEntityToProjectTaskConverter projectTaskConverter;

    @Override
    public FinalProjectTask convert(final FinalProjectTaskEntity template) {

        return new FinalProjectTask().id(template.getId())
                                         .title(template.getTitle())
                                         .icon(template.getIcon())
                                         .sortOrder(template.getSortOrder())
                                         .projectTask(projectTaskConverter.convert(template.getProjectTask()));
    }
}
