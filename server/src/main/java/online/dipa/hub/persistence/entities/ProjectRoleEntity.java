package online.dipa.hub.persistence.entities;

import java.util.Set;
import javax.persistence.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;


@Entity
@Table(name = "project_role")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectRoleEntity extends BaseEntity {

    @Size(max = 255)
    @NotEmpty
    @Basic(optional = false)
    private String name;

    @NotEmpty
    @Basic(optional = false)
    private String abbreviation;

    @NotEmpty
    @Basic(optional = false)
    private String permission;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @NotFound(action = NotFoundAction.IGNORE)
    private ProjectRoleTemplateEntity projectRoleTemplate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_project_role_connection",
            joinColumns = { @JoinColumn(name = "project_role_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id") }
    )
    private Set<UserEntity> users;

    public ProjectRoleEntity() {
        super();
    }

    // public ProjectRoleEntity(ProjectRoleEntity projectRole) {
    //     this.name = projectRole.getName();
    //     this.abbreviation = projectRole.getDateOffset();
    //     this.date = projectRole.getDate();
    //     this.status = milestone.getStatus();
    //     this.isMaster = milestone.getIsMaster();
    // }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    
    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbreviation(final String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(final String permission) {
        this.permission = permission;
    }

    public ProjectRoleTemplateEntity getProjectRoleTemplate() {
        return projectRoleTemplate;
    }

    public void setProjectRoleTemplate(final ProjectRoleTemplateEntity projectRoleTemplate) {
        this.projectRoleTemplate = projectRoleTemplate;
    }

    public Set<UserEntity> getUsers() {
        return users;
    }

    public void setUsers(final Set<UserEntity> users) {
        this.users = users;
    }
}