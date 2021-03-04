package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.ProjectEntity;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

}
