package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.TimelineTemplateEntity;

public interface TimelineTemplateRepository extends JpaRepository<TimelineTemplateEntity, Long> {
}
