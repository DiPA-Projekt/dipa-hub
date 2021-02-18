package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.ProjectTaskEntity;

public interface ProjectTaskRepository extends JpaRepository<ProjectTaskEntity, Long> {
}
