package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "single_appointment_result")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SingleAppointmentResultEntity extends BaseEntity {

    private String date;
    private String goal;
    private String responsiblePerson;

    private String status;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectTaskEntity projectTask;

    public String getDate() {
        return date;
    }

    public void setDate(final String date) {
        this.date = date;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(final String goal) {
        this.goal = goal;
    }

    public String getResponsiblePerson() {
        return responsiblePerson;
    }

    public void setResponsiblePerson(final String responsiblePerson) {
        this.responsiblePerson = responsiblePerson;
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
