package online.dipa.hub.persistence.entities;

import static javax.persistence.CascadeType.ALL;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "project_task_template")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectTaskTemplateEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "projectTaskTemplate", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ProjectTaskEntity> projectTasks = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "project_project_task_template_connection",
            joinColumns = { @JoinColumn(name = "project_task_template_id") },
            inverseJoinColumns = { @JoinColumn(name = "project_id") }
    )
    private Set<ProjectEntity> project;

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public Set<ProjectTaskEntity> getProjectTasks() {
        return projectTasks;
    }

    public void setProjectTasks(final Set<ProjectTaskEntity> projectTasks) {
        this.projectTasks = projectTasks;
    }

    public Set<ProjectEntity> getProject() {
        return project;
    }

    public void setProject(final Set<ProjectEntity> project) {
        this.project = project;
    }

}
