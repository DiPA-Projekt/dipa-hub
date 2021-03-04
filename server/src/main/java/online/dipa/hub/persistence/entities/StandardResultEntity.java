package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "standard_result")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class StandardResultEntity extends BaseEntity {

    private String content;

    private String status;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectTaskEntity projectTask;

    private String resultType;

    public String getResultType() {
        return resultType;
    }

    public void setResultType(final String resultType) {
        this.resultType = resultType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(final String content) {
        this.content = content;
    }
    
    public String getStatus() {
        return status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public ProjectTaskEntity getProjectTasks() {
        return projectTask;
    }

    public void setProjectTasks(final ProjectTaskEntity projectTask) {
        this.projectTask = projectTask;
    }

}
