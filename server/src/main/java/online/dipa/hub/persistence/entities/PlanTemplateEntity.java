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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "project_approach_plan_template_connection",
            joinColumns = { @JoinColumn(name = "plan_template_id") },
            inverseJoinColumns = { @JoinColumn(name = "project_approach_id") }
    )
    private Set<ProjectApproachEntity> projectApproaches;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "operation_type_plan_template_connection",
            joinColumns = { @JoinColumn(name = "plan_template_id") },
            inverseJoinColumns = { @JoinColumn(name = "operation_type_id") }
    )
    private Set<OperationTypeEntity> operationTypes;

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

    public Set<OperationTypeEntity> getOperationTypes() {
        return operationTypes;
    }

    public void setOperationTypes(final Set<OperationTypeEntity> operationTypes) {
        this.operationTypes = operationTypes;
    }

    public Set<ProjectApproachEntity> getProjectApproaches() {
        return projectApproaches;
    }

    public void setProjectApproaches(final Set<ProjectApproachEntity> projectApproaches) {
        this.projectApproaches = projectApproaches;
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
