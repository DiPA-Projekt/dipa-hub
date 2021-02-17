package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "risk_result")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RiskResultEntity extends BaseEntity {

    private String resultTypeId;

    private String description;
    private String value;
    private String solution;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getValue() {
        return value;
    }

    public void setValue(final String value) {
        this.value = value;
    }

    public String getSolution() {
        return solution;
    }

    public void setSolution(final String solution) {
        this.solution = solution;
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
