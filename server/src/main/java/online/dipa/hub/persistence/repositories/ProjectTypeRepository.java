package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.ProjectTypeEntity;

public interface ProjectTypeRepository extends JpaRepository<ProjectTypeEntity, Long> {
}
