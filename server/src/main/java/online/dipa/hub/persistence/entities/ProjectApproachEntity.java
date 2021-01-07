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
@Table(name = "project_approach")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectApproachEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String name;

    @Basic(optional = false)
    private boolean iterative;

    @OneToMany(mappedBy = "projectApproach", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<PlanTemplateEntity> planTemplate = new HashSet<>();

    @OneToMany(mappedBy = "projectApproach", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ProjectEntity> project = new HashSet<>();
    // @NotNull
    // @ManyToOne(optional = false, fetch = FetchType.EAGER)
    // private ProjectEntity project;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private ProjectTypeEntity projectType;

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }
    
    public boolean isIterative() {
        return iterative;
    }

    public void setIterative(final boolean iterative) {
        this.iterative = iterative;
    }

    public Set<PlanTemplateEntity> getPlanTemplate() {
        return planTemplate;
    }

    public void setPlanTemplate(final Set<PlanTemplateEntity> planTemplate) {
        this.planTemplate = planTemplate;
    }

    public ProjectTypeEntity getProjectType() {
        return projectType;
    }

    public void setProjectType(final ProjectTypeEntity projectType) {
        this.projectType = projectType;
    }

    public Set<ProjectEntity> getProject() {
        return project;
    }

    public void setProject(final Set<ProjectEntity> project) {
        this.project = project;
    }
}
