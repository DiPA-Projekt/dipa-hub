package online.dipa.hub.persistence.entities;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

import static javax.persistence.CascadeType.ALL;

@Entity
@Table(name = "project_flow_step")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectFlowStepEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String name;

    @Basic
    private int sortOrder;

    @OneToMany(mappedBy = "projectFlowStep", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ProjectFlowStepActionEntity> projectFlowStepActions = new HashSet<>();

    
    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Set<ProjectFlowStepActionEntity> getProjectFlowStepActions() {
        return projectFlowStepActions;
    }

    public void setProjectFlowStepActions(final Set<ProjectFlowStepActionEntity> projectFlowStepActions) {
        this.projectFlowStepActions = projectFlowStepActions;
    }

}