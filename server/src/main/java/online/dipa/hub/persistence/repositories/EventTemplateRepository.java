package online.dipa.hub.persistence.repositories;


import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;

import java.util.Collection;

import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.ProjectEventTemplateEntity;
import online.dipa.hub.persistence.entities.RecurringEventTypeEntity;

public interface EventTemplateRepository extends JpaRepository<ProjectEventTemplateEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from ProjectEventTemplateEntity as template join template.recurringEventType as type " +
            "where type = :recurringEventType")
    Collection<ProjectEventTemplateEntity> findByRecurringEventType(RecurringEventTypeEntity recurringEventType);


}
