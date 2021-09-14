package online.dipa.hub.server.rest;

import online.dipa.hub.api.rest.FilesApi;
import online.dipa.hub.services.DownloadFileService;
import online.dipa.hub.services.SecurityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestApiController
public class DownloadFileController implements FilesApi {

    @Autowired
    private SecurityService securityService;

    @Autowired
    private DownloadFileService downloadFileService;

    @Override
    public ResponseEntity<Resource> getFile(final Long fileId) {

        Resource urlResource = downloadFileService.getFile(fileId);

        if (urlResource != null) {
            // Access-Control-Expose-Headers
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/octet-stream"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + urlResource.getFilename() + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                    .body(urlResource);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
