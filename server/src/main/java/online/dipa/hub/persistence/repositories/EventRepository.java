package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;

import java.util.Collection;

import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.EventEntity;
import online.dipa.hub.persistence.entities.RecurringEventTypeEntity;

public interface EventRepository extends JpaRepository<EventEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from EventEntity as event join event.eventTemplate.recurringEventType as type " +
            "where type = :recurringEventType")
    Collection<EventEntity> findByRecurringEventType(RecurringEventTypeEntity recurringEventType);


}
