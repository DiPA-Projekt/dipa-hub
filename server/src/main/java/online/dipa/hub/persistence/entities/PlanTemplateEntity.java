package online.dipa.hub.persistence.entities;

import static javax.persistence.CascadeType.ALL;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Basic;
import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "plan_template")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PlanTemplateEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "planTemplate", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<MilestoneTemplateEntity> milestones = new HashSet<>();

    @OneToMany(mappedBy = "planTemplate", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<TaskTemplateEntity> tasks = new HashSet<>();

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private ProjectApproachEntity projectApproach;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private OperationTypeEntity operationType;

    @Basic(optional = false)
    private boolean standard;

    @Basic(optional = false)
    private boolean defaultTemplate;

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public Set<MilestoneTemplateEntity> getMilestones() {
        return milestones;
    }

    public void setMilestones(final Set<MilestoneTemplateEntity> milestones) {
        this.milestones = milestones;
    }

    public Set<TaskTemplateEntity> getTasks() {
        return tasks;
    }

    public void setTask(final Set<TaskTemplateEntity> tasks) {
        this.tasks = tasks;
    }

    public OperationTypeEntity getOperationTypeEntity() {
        return operationType;
    }

    public void setOperationTypeEntity(final OperationTypeEntity operationType) {
        this.operationType = operationType;
    }

    public ProjectApproachEntity getProjectApproach() {
        return projectApproach;
    }

    public void setProjectApproach(final ProjectApproachEntity projectApproach) {
        this.projectApproach = projectApproach;
    }

    public boolean getStandard() {
        return standard;
    }

    public void setStandard(final boolean standard) {
        this.standard = standard;
    }

    public boolean getDefaultTemplate() {
        return defaultTemplate;
    }

    public void setDefaultTemplate(final boolean defaultTemplate) {
        this.defaultTemplate = defaultTemplate;
    }
}
