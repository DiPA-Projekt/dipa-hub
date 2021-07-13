package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.NonPermanentProjectTaskEntity;

public interface NonPermanentProjectTaskRepository extends JpaRepository<NonPermanentProjectTaskEntity, Long> {
}
