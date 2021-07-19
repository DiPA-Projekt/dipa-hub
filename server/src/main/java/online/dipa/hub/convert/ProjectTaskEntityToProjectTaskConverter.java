package online.dipa.hub.convert;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import online.dipa.hub.api.model.FormField;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.ProjectTask;
import online.dipa.hub.api.model.Result;
import online.dipa.hub.persistence.entities.FormFieldEntity;
import online.dipa.hub.persistence.entities.ProjectTaskEntity;


@Component
public class ProjectTaskEntityToProjectTaskConverter implements Converter<ProjectTaskEntity, ProjectTask> {

    @Autowired
    private ResultEntityToResultConverter resultEntityToResultConverter;

    @Autowired
    private FormFieldEntityToFormFieldConverter formFieldConverter;

    @Autowired
    private PropertyQuestionEntityToPropertyQuestionConverter propertyQuestionConverter;

    @Override
    public ProjectTask convert(final ProjectTaskEntity template) {

        ProjectTask projectTask = new ProjectTask().id(template.getId())
                             .title(template.getTitle())
                             .completed((template.getCompleted()))
                             .icon(template.getIcon())
                             .explanation(template.getExplanation())
                             .isPermanentTask(template.getIsPermanentTask())
                             .titlePermanentTask(template.getTitlePermanentTask())
                             .sortOrder(template.getSortOrder());

        if (template.getProjectPropertyQuestion() != null) {
            projectTask.projectPropertyQuestion(propertyQuestionConverter.convert(
                    template.getProjectPropertyQuestion()));
        }
        List<FormField> entries = template.getEntries().stream().sorted(Comparator.comparing(FormFieldEntity::getSortOrder)).map(p -> formFieldConverter.convert(p)).collect(Collectors.toList());
        projectTask.entries(entries);

        if (!template.getResults().isEmpty()) {
            List<Result> results = template.getResults().stream().map(p -> resultEntityToResultConverter.convert(p)).collect(Collectors.toList());
            projectTask.results(results);
        }
                
        return projectTask;
    }
}
