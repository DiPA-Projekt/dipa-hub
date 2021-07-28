package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;

import java.util.Optional;
import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.ProjectApproachEntity;

public interface ProjectApproachRepository extends JpaRepository<ProjectApproachEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from ProjectApproachEntity a where a.id = (select min(a.id) from ProjectApproachEntity a)")
    Optional<ProjectApproachEntity> getOneProjectApproachEntity();


}
