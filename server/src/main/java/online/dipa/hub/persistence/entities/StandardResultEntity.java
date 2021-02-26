package online.dipa.hub.persistence.entities;

import java.util.Set;

import javax.persistence.*;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "standard_result")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class StandardResultEntity extends BaseEntity {

    private String content;

    private String status;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "standard_result_project_task_connection",
            joinColumns = { @JoinColumn(name = "standard_result_id") },
            inverseJoinColumns = { @JoinColumn(name = "project_task_id") }
    )
    private Set<ProjectTaskEntity> projectTasks;

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

    public Set<ProjectTaskEntity> getProjectTasks() {
        return projectTasks;
    }

    public void setProjectTasks(final Set<ProjectTaskEntity> projectTasks) {
        this.projectTasks = projectTasks;
    }

}
