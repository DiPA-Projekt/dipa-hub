package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "appointment_series_result")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AppointmentSeriesResultEntity extends BaseEntity {

    private String resultTypeId;
    private String appointment;
    private String participants;
    private String link;

    private String status;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectTaskEntity projectTask;

    public String getResultTypeId() {
        return resultTypeId;
    }

    public void setResultTypeId(final String resultTypeId) {
        this.resultTypeId = resultTypeId;
    }

    public String getAppointment() {
        return appointment;
    }

    public void setAppointment(final String appointment) {
        this.appointment = appointment;
    }

    public String getParticipants() {
        return participants;
    }

    public void setParticipants(final String participants) {
        this.participants = participants;
    }

    public String getLink() {
        return link;
    }

    public void setLink(final String link) {
        this.link = link;
    }
    
    public String getStatus() {
        return status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public ProjectTaskEntity getProjectTask() {
        return projectTask;
    }

    public void setProjectTask(final ProjectTaskEntity projectTask) {
        this.projectTask = projectTask;
    }

}
