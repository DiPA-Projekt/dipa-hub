package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;

import java.util.Collection;
import java.util.Optional;

import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.api.model.PlanTemplate;
import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.UserEntity;

public interface MilestoneTemplateRepository extends JpaRepository<MilestoneTemplateEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from MilestoneTemplateEntity m where m.planTemplate = :planTemplate")
    Collection<MilestoneTemplateEntity> findByPlanTemplate(PlanTemplateEntity planTemplate);
}
