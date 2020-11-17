package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.TaskTemplateEntity;

public interface TaskTemplateRepository extends JpaRepository<TaskTemplateEntity, Long> {
}
