package online.dipa.hub.persistence.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "project_role_template")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectRoleTemplateEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "projectRoleTemplate", cascade = CascadeType.ALL,
      fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ProjectApproachEntity> projectApproaches = new HashSet<>();
    
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "projectRoleTemplate", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ProjectRoleEntity> projectRoles = new HashSet<>();

    @NotNull
    @OneToOne(fetch = FetchType.EAGER)
    private ProjectEntity project;

    public ProjectRoleTemplateEntity() {
        super();
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public Set<ProjectApproachEntity> getProjectApproaches() {
        return projectApproaches;
    }

    public void setProjectApproaches(final Set<ProjectApproachEntity> projectApproaches) {
        this.projectApproaches = projectApproaches;
    }

    public ProjectEntity getProject() {
        return project;
    }
    
    public void setProject(final ProjectEntity project) {
        this.project = project;
    }


    public Set<ProjectRoleEntity> getProjectRoles() {
        return projectRoles;
    }

    public void setProjectRoles(final Set<ProjectRoleEntity> projectRoles) {
        this.projectRoles = projectRoles;
    }
}
