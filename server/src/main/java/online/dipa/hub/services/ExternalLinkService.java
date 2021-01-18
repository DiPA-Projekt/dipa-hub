package online.dipa.hub.services;

import online.dipa.hub.api.model.ExternalLink;
import online.dipa.hub.persistence.repositories.ExternalLinkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.SessionScope;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SessionScope
@Transactional
public class ExternalLinkService {

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ExternalLinkRepository externalLinkRepository;

    public List<ExternalLink> getExternalLinks() {

        final List<ExternalLink> externalLinks = externalLinkRepository.findAll()
                .stream()
                .map(p -> conversionService.convert(p, ExternalLink.class))
                .collect(Collectors.toList());

        return externalLinks;
    }

    public List<ExternalLink> getFavoriteLinks() {

        final List<ExternalLink> favoriteLinks = externalLinkRepository.findAll()
                .stream()
                .map(p -> conversionService.convert(p, ExternalLink.class))
                .filter(p -> p.getFavorite().equals(true))
                .collect(Collectors.toList());

        return favoriteLinks;
    }
}