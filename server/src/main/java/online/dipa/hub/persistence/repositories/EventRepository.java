package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.EventEntity;

public interface EventRepository extends JpaRepository<EventEntity, Long> {

}
