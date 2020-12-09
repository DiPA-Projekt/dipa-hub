package online.dipa.hub.persistence.entities;

import static javax.persistence.CascadeType.ALL;

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

    @OneToMany(mappedBy = "projectType", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<PlanTemplateEntity> planTemplate = new HashSet<>();

    @OneToMany(mappedBy = "projectType", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ProjectApproachEntity> projectApproach = new HashSet<>();

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

    public Set<ProjectApproachEntity> getProjectApproach() {
        return projectApproach;
    }

    public void setProjectApproach(final Set<ProjectApproachEntity> projectApproach) {
        this.projectApproach = projectApproach;
    }
    
    public Set<PlanTemplateEntity> getPlanTemplate() {
        return planTemplate;
    }

    public void setPlanTemplate(final Set<PlanTemplateEntity> planTemplate) {
        this.planTemplate = planTemplate;
    }
}
