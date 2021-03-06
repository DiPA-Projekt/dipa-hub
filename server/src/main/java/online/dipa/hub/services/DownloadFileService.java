package online.dipa.hub.services;

import online.dipa.hub.api.model.DownloadFile;
import online.dipa.hub.persistence.repositories.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Optional;

@Service
@Transactional
public class DownloadFileService {

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private FileRepository fileRepository;

    public Resource getFile(final Long fileId) {

        Optional<DownloadFile> downloadFile = fileRepository.findById(fileId)
                .map(p -> conversionService.convert(p, DownloadFile.class));

        if (downloadFile.isPresent()) {

            String filePath = downloadFile.get().getPath();

            ClassLoader classLoader = getClass().getClassLoader();
            URL resource = classLoader.getResource(filePath);

            if (resource == null) {
                throw new IllegalArgumentException("file not found! " + filePath);
            } else {
                try {
                    return new UrlResource(resource.toURI());
                } catch (MalformedURLException | URISyntaxException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

}