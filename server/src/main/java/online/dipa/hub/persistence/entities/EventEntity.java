package online.dipa.hub.persistence.entities;
import java.time.OffsetDateTime;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "event")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EventEntity extends BaseEntity {

    private String title;
    private String eventType;
    private OffsetDateTime dateTime;
    private Integer duration;
    private String status;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectEntity project;

    @ManyToOne(fetch = FetchType.EAGER)
    private ResultEntity result;

    @ManyToOne(fetch = FetchType.EAGER)
    private RecurringEventTypeEntity recurringEventType;

    public EventEntity() {
        super();
    }

    public EventEntity(String title, String eventType, OffsetDateTime dateTime, Integer duration, String status,
            ProjectEntity project, RecurringEventTypeEntity recurringEventType) {
        this.title = title;
        this.eventType = eventType;
        this.dateTime = dateTime;
        this.duration = duration;
        this.status = status;
        this.project = project;
        this.recurringEventType = recurringEventType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(final String eventType) {
        this.eventType = eventType;
    }


    public OffsetDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(final OffsetDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(final Integer duration) {
        this.duration = duration;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(final ProjectEntity project) {
        this.project = project;
    }

    public ResultEntity getResult() {
        return result;
    }

    public void setResult(final ResultEntity result) {
        this.result = result;
    }

    public RecurringEventTypeEntity getRecurringEventType() {
        return recurringEventType;
    }

    public void setRecurringEventType(final RecurringEventTypeEntity recurringEventType) {
        this.recurringEventType = recurringEventType;
    }
}
