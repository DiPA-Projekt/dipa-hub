package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import online.dipa.hub.persistence.entities.ProjectRoleEntity;

public interface ProjectRoleRepository extends JpaRepository<ProjectRoleEntity, Long> {
}
