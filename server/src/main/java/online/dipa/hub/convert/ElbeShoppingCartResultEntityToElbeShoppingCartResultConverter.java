package online.dipa.hub.convert;

import online.dipa.hub.api.model.ELBEshoppingCartResult;
import online.dipa.hub.api.model.FormField;
import online.dipa.hub.persistence.entities.ELBEShoppingCartResultEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ElbeShoppingCartResultEntityToElbeShoppingCartResultConverter implements Converter<ELBEShoppingCartResultEntity, ELBEshoppingCartResult> {

    @Autowired
    private FormFieldEntityToFormFieldConverter formFieldEntityToFormFieldConverter;

    @Override
    public ELBEshoppingCartResult convert(final ELBEShoppingCartResultEntity entity) {

        ELBEshoppingCartResult elbeShoppingCartResult = new ELBEshoppingCartResult();

        List<FormField> formFields = entity.getFormFields().stream().map(p -> formFieldEntityToFormFieldConverter.convert(p)).collect(Collectors.toList());
        elbeShoppingCartResult.formFields(formFields);

        return (ELBEshoppingCartResult) elbeShoppingCartResult.resultType(String.valueOf(entity.getResultType()));
    }
}
