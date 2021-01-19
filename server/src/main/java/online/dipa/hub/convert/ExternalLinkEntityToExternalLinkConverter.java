package online.dipa.hub.convert;

import online.dipa.hub.api.model.ExternalLink;
import online.dipa.hub.persistence.entities.ExternalLinkEntity;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class ExternalLinkEntityToExternalLinkConverter implements Converter<ExternalLinkEntity, ExternalLink> {
    @Override
    public ExternalLink convert(final ExternalLinkEntity entity) {

        return new ExternalLink().id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .url(entity.getUrl())
                .img(entity.getImg())
                .category(entity.getCategory())
                .sortOrder(entity.getSortOrder())
                .favorite(entity.getId() % 2 == 1);
    }
}
