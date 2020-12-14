package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.PlanTemplateEntity;

public interface PlanTemplateRepository extends JpaRepository<PlanTemplateEntity, Long> {
}
