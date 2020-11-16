package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;

public interface MilestoneTemplateRepository extends JpaRepository<MilestoneTemplateEntity, Long> {
}
