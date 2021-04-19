package online.dipa.hub.convert;

import online.dipa.hub.api.model.FormField;
import online.dipa.hub.api.model.Result;
import online.dipa.hub.persistence.entities.FormFieldEntity;
import online.dipa.hub.persistence.entities.ResultEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ResultEntityToResultConverter implements Converter<ResultEntity, Result> {

    @Autowired
    private FormFieldEntityToFormFieldConverter formFieldEntityToFormFieldConverter;

    @Override
    public Result convert(final ResultEntity entity) {

        Result result = new Result();
        result.id(entity.getId());
        
        List<FormField> formFields = entity.getFormFields().stream().sorted(Comparator.comparing(FormFieldEntity::getSortOrder)).map(p -> formFieldEntityToFormFieldConverter.convert(p)).collect(Collectors.toList());
        result.resultType(Result.ResultTypeEnum.valueOf(entity.getResultType()))
                .formFields(formFields);

        return result.resultType(Result.ResultTypeEnum.valueOf(String.valueOf(entity.getResultType())));
    }
}
