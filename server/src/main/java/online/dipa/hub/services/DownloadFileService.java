package online.dipa.hub.services;

import online.dipa.hub.api.model.DownloadFile;
import online.dipa.hub.api.model.ExternalLink;
import online.dipa.hub.persistence.repositories.ExternalLinkRepository;
import online.dipa.hub.persistence.repositories.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.SessionScope;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;
import java.util.stream.Collectors;

@Service
@SessionScope
@Transactional
public class DownloadFileService {

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private FileRepository fileRepository;

    public Resource getFile(final Long fileId) {

        Optional<DownloadFile> downloadFile = fileRepository.findAll()
                .stream()
                .filter(file -> file.getId().equals(fileId))
                .map(p -> conversionService.convert(p, DownloadFile.class)).findFirst();

        if (downloadFile.isPresent()) {

            String filePath = downloadFile.get().getPath();
            Path path = Paths.get(filePath);

            try {
                return new UrlResource(path.toUri());
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

}