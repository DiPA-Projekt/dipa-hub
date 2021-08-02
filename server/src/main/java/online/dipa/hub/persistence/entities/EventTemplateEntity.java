package online.dipa.hub.persistence.entities;
import static javax.persistence.CascadeType.ALL;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "event_template")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EventTemplateEntity extends BaseEntity {

    private String title;
    private String eventType;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectEntity project;

    @ManyToOne(fetch = FetchType.EAGER)
    private ResultEntity result;

    @ManyToOne(fetch = FetchType.EAGER)
    private RecurringEventTypeEntity recurringEventType;

    @OneToMany(mappedBy = "eventTemplate", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<EventEntity> events = new HashSet<>();

    public EventTemplateEntity() {
        super();
    }

    public EventTemplateEntity(String title, String eventType,
            ProjectEntity project, RecurringEventTypeEntity recurringEventType) {
        this.title = title;
        this.eventType = eventType;
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

    public Set<EventEntity> getEvents() {
        return events;
    }

    public void setEvents(final Set<EventEntity> events) {
        this.events = events;
    }
}
