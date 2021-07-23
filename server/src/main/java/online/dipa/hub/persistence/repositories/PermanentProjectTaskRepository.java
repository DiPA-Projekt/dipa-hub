package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.PermanentProjectTaskEntity;

public interface PermanentProjectTaskRepository extends JpaRepository<PermanentProjectTaskEntity, Long> {
}
