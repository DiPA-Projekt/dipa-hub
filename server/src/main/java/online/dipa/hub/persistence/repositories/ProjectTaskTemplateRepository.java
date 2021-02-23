package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.ProjectTaskTemplateEntity;

public interface ProjectTaskTemplateRepository extends JpaRepository<ProjectTaskTemplateEntity, Long> {
}
