package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.*;
import online.dipa.hub.api.rest.ExternalLinksApi;
import online.dipa.hub.services.ExternalLinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;


@RestApiController
public class ExternalLinkController implements ExternalLinksApi {

    @Autowired
    private ExternalLinkService externalLinkService;

    @Override
    public ResponseEntity<List<ExternalLink>> getExternalLinks() {
        final List<ExternalLink> externalLinks = externalLinkService.getExternalLinks();
        return ResponseEntity.ok(externalLinks);
    }

    @Override
    public ResponseEntity<List<ExternalLink>> getFavoriteLinks() {
        final List<ExternalLink> favoriteLinks = externalLinkService.getFavoriteLinks();
        return ResponseEntity.ok(favoriteLinks);
    }

}
