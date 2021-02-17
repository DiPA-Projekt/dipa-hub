package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "contact_person_result")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ContactPersonResultEntity extends BaseEntity {

    private String resultTypeId;
    private String name;
    private String department;
    private String taskArea;

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

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(final String department) {
        this.department = department;
    }

    public String getTaskAre() {
        return taskArea;
    }

    public void setTaskAre(final String taskArea) {
        this.taskArea = taskArea;
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
