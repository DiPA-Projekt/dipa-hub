package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.PropertyQuestion;
import online.dipa.hub.persistence.entities.ProjectPropertyQuestionEntity;

@Component
public class PropertyQuestionEntityToPropertyQuestionConverter implements Converter<ProjectPropertyQuestionEntity, PropertyQuestion> {

    @Override
    public PropertyQuestion convert(final ProjectPropertyQuestionEntity entity) {

        PropertyQuestion propertyQuestion = new PropertyQuestion()
                .id(entity.getId())
                .question(entity.getQuestion())
                .description(entity.getDescription())
                .selected(entity.getSelected())
                .sortOrder(entity.getSortOrder());

        return propertyQuestion;
    }
}
