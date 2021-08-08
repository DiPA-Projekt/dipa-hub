package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.ProjectEventEntity;

public interface EventRepository extends JpaRepository<ProjectEventEntity, Long> {

}
