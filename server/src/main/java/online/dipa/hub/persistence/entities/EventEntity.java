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
    private OffsetDateTime dateTime;
    private Integer duration;
    private String status;

    @ManyToOne(fetch = FetchType.EAGER)
    private EventTemplateEntity eventTemplate;

    public EventEntity() {
        super();
    }

    public EventEntity(String title, OffsetDateTime dateTime, Integer duration, String status, EventTemplateEntity eventTemplate) {
        this.title = title;
//        this.eventType = eventType;
        this.dateTime = dateTime;
        this.duration = duration;
        this.status = status;
        this.eventTemplate = eventTemplate;
//        this.project = project;
//        this.recurringEventType = recurringEventType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }
//
//    public String getEventType() {
//        return eventType;
//    }
//
//    public void setEventType(final String eventType) {
//        this.eventType = eventType;
//    }


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

//    public ProjectEntity getProject() {
//        return project;
//    }
//
//    public void setProject(final ProjectEntity project) {
//        this.project = project;
//    }
//
//    public ResultEntity getResult() {
//        return result;
//    }
//
//    public void setResult(final ResultEntity result) {
//        this.result = result;
//    }
//
//    public RecurringEventTypeEntity getRecurringEventType() {
//        return recurringEventType;
//    }
//
//    public void setRecurringEventType(final RecurringEventTypeEntity recurringEventType) {
//        this.recurringEventType = recurringEventType;
//    }
    public EventTemplateEntity getEventTemplate() {
        return eventTemplate;
    }

    public void setEventTemplate(final EventTemplateEntity eventTemplate) {
        this.eventTemplate = eventTemplate;
    }
}
