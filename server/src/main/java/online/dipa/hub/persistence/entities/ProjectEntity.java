package online.dipa.hub.persistence.entities;

import java.util.Set;

import javax.persistence.*;
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
    
    @OneToMany(mappedBy = "project")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ProjectTaskTemplateEntity> projectTaskTemplates;

    private String projectType;
    private String projectSize;
    private String akz;
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

    public void setAkz(final String akz) {
        this.akz = akz;
    }

    public String getAkz() {
        return akz;
    }

    public Set<ProjectTaskTemplateEntity> getProjectTaskTemplates() {
        return projectTaskTemplates;
    }

    public void setProjectTaskTemplates(final Set<ProjectTaskTemplateEntity> projectTaskTemplates) {
        this.projectTaskTemplates = projectTaskTemplates;
    }
    
    public void setProjectSize(final String projectSize) {
        this.projectSize = projectSize;
    }

    public String getProjectSize() {
        return projectSize;
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
