package online.dipa.hub.persistence.entities;

import static javax.persistence.CascadeType.ALL;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Basic;
import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "non_permanent_project_task_template")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class NonPermanentProjectTaskTemplateEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String name;

    private boolean master;

    @OneToMany(mappedBy = "nonPermanentProjectTaskTemplate", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<NonPermanentProjectTaskEntity> nonPermanentProjectTasks = new HashSet<>();

    @NotNull
    @OneToOne(fetch = FetchType.EAGER)
    private ProjectEntity project;

    public NonPermanentProjectTaskTemplateEntity() {
        super();
    }

    public NonPermanentProjectTaskTemplateEntity(String name, boolean master, ProjectEntity project) {
        this.name = name;
        this.master = master;
        this.project = project;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public boolean getMaster() {
        return master;
    }

    public void setMaster(final boolean master) {
        this.master = master;
    }

    public Set<NonPermanentProjectTaskEntity> getNonPermanentProjectTasks() {
        return nonPermanentProjectTasks;
    }

    public void setNonPermanentProjectTasks(final Set<NonPermanentProjectTaskEntity> nonPermanentProjectTasks) {
        this.nonPermanentProjectTasks = nonPermanentProjectTasks;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(final ProjectEntity project) {
        this.project = project;
    }

}
