package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.NonPermanentProjectTaskTemplateEntity;

public interface NonPermanentProjectTaskTemplateRepository extends JpaRepository<NonPermanentProjectTaskTemplateEntity, Long> {
}
