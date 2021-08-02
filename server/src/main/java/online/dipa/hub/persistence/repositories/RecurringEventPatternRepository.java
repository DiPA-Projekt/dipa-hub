package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.RecurringEventPatternEntity;

public interface RecurringEventPatternRepository extends JpaRepository<RecurringEventPatternEntity, Long> {

}
