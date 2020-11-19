package online.dipa.hub.persistence.entities;

import static javax.persistence.CascadeType.ALL;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Basic;
import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "project_type")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectTypeEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String name;

    @Basic(optional = false)
    private boolean defaultType;

    @Basic(optional = false)
    private LocalDate start;

    @Basic(optional = false)
    private LocalDate end;

    @OneToMany(mappedBy = "projectType", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<MilestoneTemplateEntity> milestones = new HashSet<>();

    @OneToMany(mappedBy = "projectType", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<TaskTemplateEntity> task = new HashSet<>();

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public boolean isDefaultType() {
        return defaultType;
    }

    public void setDefaultType(final boolean defaultType) {
        this.defaultType = defaultType;
    }

    public LocalDate getStart() {
        return start;
    }

    public void setStart(final LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return end;
    }

    public void setEnd(final LocalDate end) {
        this.end = end;
    }

    public Set<MilestoneTemplateEntity> getMilestones() {
        return milestones;
    }

    public void setMilestones(final Set<MilestoneTemplateEntity> milestones) {
        this.milestones = milestones;
    }

    public Set<TaskTemplateEntity> getTask() {
        return task;
    }

    public void setTask(final Set<TaskTemplateEntity> task) {
        this.task = task;
    }
}
