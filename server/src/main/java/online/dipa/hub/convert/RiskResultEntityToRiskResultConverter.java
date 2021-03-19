package online.dipa.hub.convert;

import online.dipa.hub.api.model.FormField;
import online.dipa.hub.api.model.RiskResult;
import online.dipa.hub.persistence.entities.RiskResultEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;


@Component
public class RiskResultEntityToRiskResultConverter implements Converter<RiskResultEntity, RiskResult> {

    @Autowired
    private FormFieldEntityToFormFieldConverter formFieldEntityToFormFieldConverter;

    @Override
    public RiskResult convert(final RiskResultEntity entity) {

        RiskResult riskResult =  new RiskResult();

        List<FormField> formFields = entity.getFormFields().stream().map(p -> formFieldEntityToFormFieldConverter.convert(p)).collect(Collectors.toList());
        riskResult.formFields(formFields);

        return (RiskResult) riskResult.resultType(String.valueOf(entity.getResultType()));
    }
}
