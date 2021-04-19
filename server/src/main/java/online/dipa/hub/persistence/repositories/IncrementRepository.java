package online.dipa.hub.persistence.repositories;

import online.dipa.hub.persistence.entities.IncrementEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IncrementRepository extends JpaRepository<IncrementEntity, Long> {
}
