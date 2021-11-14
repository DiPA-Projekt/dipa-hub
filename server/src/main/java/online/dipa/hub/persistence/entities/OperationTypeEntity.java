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
@Table(name = "operation_type")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OperationTypeEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String name;

    @Basic(optional = false)
    private boolean defaultType;

    @OneToMany(mappedBy = "operationType", cascade = { ALL })
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
}
