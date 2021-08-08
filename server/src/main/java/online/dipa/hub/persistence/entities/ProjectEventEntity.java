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
@Table(name = "project_event")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectEventEntity extends BaseEntity {

    private String title;
    private OffsetDateTime dateTime;
    private Integer duration;
    private String status;

    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectEventTemplateEntity projectEventTemplate;

    public ProjectEventEntity() {
        super();
    }

    public ProjectEventEntity(String title, OffsetDateTime dateTime, Integer duration, String status, ProjectEventTemplateEntity projectEventTemplate) {
        this.title = title;
        this.dateTime = dateTime;
        this.duration = duration;
        this.status = status;
        this.projectEventTemplate = projectEventTemplate;
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

    public ProjectEventTemplateEntity getProjectEventTemplate() {
        return projectEventTemplate;
    }

    public void setProjectEventTemplate(final ProjectEventTemplateEntity eventTemplate) {
        this.projectEventTemplate = eventTemplate;
    }
}
