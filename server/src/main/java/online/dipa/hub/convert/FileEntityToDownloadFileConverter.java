package online.dipa.hub.convert;

import online.dipa.hub.api.model.DownloadFile;
import online.dipa.hub.api.model.ExternalLink;
import online.dipa.hub.persistence.entities.ExternalLinkEntity;
import online.dipa.hub.persistence.entities.FileEntity;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class FileEntityToDownloadFileConverter implements Converter<FileEntity, DownloadFile> {
    @Override
    public DownloadFile convert(final FileEntity entity) {

        return new DownloadFile().id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .path(entity.getPath());
    }
}
