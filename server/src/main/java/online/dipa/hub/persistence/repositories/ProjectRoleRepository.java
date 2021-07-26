package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;
import java.util.Optional;
import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.ProjectRoleEntity;
import online.dipa.hub.persistence.entities.ProjectRoleTemplateEntity;

public interface ProjectRoleRepository extends JpaRepository<ProjectRoleEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from ProjectRoleEntity as pr where pr.projectRoleTemplate = :projectRoleTemplate and pr.abbreviation = :abbreviation")
    Optional<ProjectRoleEntity> findByTemplateAndAbbreviation(ProjectRoleTemplateEntity projectRoleTemplate, String abbreviation);

}
