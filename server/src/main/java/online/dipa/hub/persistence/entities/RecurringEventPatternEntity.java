package online.dipa.hub.persistence.entities;

import java.time.LocalDate;
import java.time.LocalTime;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "recurring_event_pattern")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RecurringEventPatternEntity extends BaseEntity {

    private String title;
    private String rulePattern;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private Integer duration;

    @OneToOne(fetch = FetchType.EAGER)
    private ResultEntity result;

    @OneToOne(fetch = FetchType.EAGER)
    private RecurringEventTypeEntity recurringEventType;

    public RecurringEventPatternEntity() {
        super();
    }

    public RecurringEventPatternEntity(RecurringEventPatternEntity entity, ProjectEntity project) {
        this.title = entity.getTitle();
        this.rulePattern = entity.getRulePattern();
        this.startDate = project.getStartDate().toLocalDate();
        this.endDate = project.getEndDate().toLocalDate();
        this.startTime = entity.getStartTime();
        this.duration = entity.getDuration();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getRulePattern() {
        return rulePattern;
    }

    public void setRulePattern(final String rulePattern) {
        this.rulePattern = rulePattern;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(final Integer duration) {
        this.duration = duration;
    }

    public RecurringEventTypeEntity getRecurringEventType() {
        return recurringEventType;
    }

    public void setRecurringEventType(RecurringEventTypeEntity recurringEventType) {
        this.recurringEventType = recurringEventType;
    }

    public ResultEntity getResult() {
        return result;
    }

    public void setResult(ResultEntity result) {
        this.result = result;
    }
}
