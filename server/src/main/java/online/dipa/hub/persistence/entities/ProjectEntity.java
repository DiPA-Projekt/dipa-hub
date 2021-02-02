package online.dipa.hub.persistence.entities;

import javax.persistence.Basic;
import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonInclude;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "project")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String name;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private ProjectApproachEntity projectApproach;

    private String projectType;
    private String projectSize;

    private String AKZ;
    private String client;
    private String department;
    private String projectOwner;

    
    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public ProjectApproachEntity getProjectApproach() {
        return projectApproach;
    }

    public void setProjectApproach(final ProjectApproachEntity projectApproach) {
        this.projectApproach = projectApproach;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(final String projectType) {
        this.projectType = projectType;
    }

    public String getAKZ() {
        return AKZ;
    }
    
    public void setProjectSize(final String projectSize) {
        this.projectSize = projectSize;
    }

    public String getProjectSize() {
        return projectSize;
    }

    public void setAKZ(final String AKZ) {
        this.AKZ = AKZ;
    }

    public String getClient() {
        return client;
    }

    public void setClient(final String client) {
        this.client = client;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(final String department) {
        this.department = department;
    }

    public String getProjectOwner() {
        return projectOwner;
    }

    public void setProjectOwner(final String projectOwner) {
        this.projectOwner = projectOwner;
    }

}
