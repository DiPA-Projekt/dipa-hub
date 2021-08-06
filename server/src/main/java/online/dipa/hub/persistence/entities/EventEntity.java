package online.dipa.hub.persistence.entities;

import java.time.OffsetDateTime;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

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
        this.dateTime = dateTime;
        this.duration = duration;
        this.status = status;
        this.eventTemplate = eventTemplate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
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

    public EventTemplateEntity getEventTemplate() {
        return eventTemplate;
    }

    public void setEventTemplate(final EventTemplateEntity eventTemplate) {
        this.eventTemplate = eventTemplate;
    }
}
