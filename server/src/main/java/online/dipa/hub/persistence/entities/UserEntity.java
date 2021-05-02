package online.dipa.hub.persistence.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
@Table(name = "user")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserEntity extends BaseEntity {
    
    @Basic(optional = false)
    private String keycloakId;

    @Size(max = 255)
    @Basic(optional = false)
    private String name;
    
    @OneToMany(mappedBy = "user")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @NotFound(action = NotFoundAction.IGNORE)
    private Set<ProjectEntity> projects;

    private String tenantId;
    private String email;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_project_role_connection",
            joinColumns = { @JoinColumn(name = "user_id") },
            inverseJoinColumns = { @JoinColumn(name = "project_role_id") }
    )
    private Set<ProjectRoleEntity> projectRoles = new HashSet<>();


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_organisation_role_connection",
            joinColumns = { @JoinColumn(name = "user_id") },
            inverseJoinColumns = { @JoinColumn(name = "organisation_role_id") }
    )
    private Set<OrganisationRoleEntity> organisationRoles = new HashSet<>();

    public UserEntity() {
        super();
    }
    
    public UserEntity(String name, String tenantId, String keycloakId) {
        this.name = name;
        this.tenantId = tenantId;
        this.keycloakId = keycloakId;
    }

    public String getKeycloakId() {
        return keycloakId;
    }

    public void setKeycloakId(final String keycloakId) {
        this.keycloakId = keycloakId;
    }
    
    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(final String tenantId) {
        this.tenantId = tenantId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(final String email) {
        this.email = email;
    }
    
    public Set<ProjectRoleEntity> getProjectRoles() {
        return projectRoles;
    }

    public void setProjectRoles(final Set<ProjectRoleEntity> projectRoles) {
        this.projectRoles = projectRoles;
    }
    
    public Set<OrganisationRoleEntity> getOrganisationRoles() {
        return organisationRoles;
    }

    public void setOrganisationRoles(final Set<OrganisationRoleEntity> organisationRoles) {
        this.organisationRoles = organisationRoles;
    }

    public Set<ProjectEntity> getProjects() {
        return projects;
    }

    public void setProjects(final Set<ProjectEntity> projects) {
        this.projects = projects;
    }


}
