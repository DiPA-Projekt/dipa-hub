package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.PermanentProjectTaskTemplateEntity;

public interface PermanentProjectTaskTemplateRepository extends JpaRepository<PermanentProjectTaskTemplateEntity, Long> {
}
