package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;
import java.util.Optional;
import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.ProjectTaskTemplateEntity;

public interface ProjectTaskTemplateRepository extends JpaRepository<ProjectTaskTemplateEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from ProjectTaskTemplateEntity t where t.master = true")
    Optional<ProjectTaskTemplateEntity> findByMaster();
}
