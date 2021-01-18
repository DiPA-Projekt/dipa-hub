package online.dipa.hub.persistence.repositories;

import online.dipa.hub.persistence.entities.ExternalLinkEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExternalLinkRepository extends JpaRepository<ExternalLinkEntity, Long> {
}
