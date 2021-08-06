package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;

import java.time.LocalDate;
import java.time.LocalTime;

import javax.persistence.QueryHint;
import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.RecurringEventPatternEntity;

public interface RecurringEventPatternRepository extends JpaRepository<RecurringEventPatternEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Transactional
    @Modifying
    @Query("update RecurringEventPatternEntity c " +
            "SET c.title = :title, c.rulePattern = :rulePattern, c.startDate = :startDate," +
            "c.endDate = :endDate, c.startTime = :startTime, c.duration = :duration " +
            "WHERE c.id = :id")
    void updateRecurringPattern(Long id, String title, String rulePattern, LocalDate startDate,
            LocalDate endDate, LocalTime startTime, Integer duration);

}
