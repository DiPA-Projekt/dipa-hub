package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;

import java.util.Collection;
import java.util.Optional;

import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;

public interface PlanTemplateRepository extends JpaRepository<PlanTemplateEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from PlanTemplateEntity as template join template.projectApproaches as approach " +
            "where template.standard = true and approach = :projectApproach")
    Optional<PlanTemplateEntity> findByStandardAndProjectApproach(ProjectApproachEntity projectApproach);

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from PlanTemplateEntity as template join template.projectApproaches as approach " +
            "where template.defaultTemplate = true and approach = :projectApproach")
    Optional<PlanTemplateEntity> findByDefaultAndProjectApproach(ProjectApproachEntity projectApproach);

}
