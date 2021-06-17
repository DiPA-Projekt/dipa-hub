package online.dipa.hub.persistence.entities;

import java.util.Set;
import javax.persistence.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import online.dipa.hub.api.model.ProjectRole;
import static javax.persistence.CascadeType.ALL;

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

    @Basic(optional = true)
    private String icon;

    @NotEmpty
    @Basic(optional = false)
    private String permission;
    
    @Basic(optional = true)
    private boolean defaultRole;

    @Basic
    @Column(nullable = false)
    private int maxCount;

    @ManyToOne(fetch=FetchType.EAGER)
    @NotFound(action = NotFoundAction.IGNORE)
    private ProjectRoleTemplateEntity projectRoleTemplate;

    @ManyToMany(mappedBy = "projectRoles")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<UserEntity> users;

    public ProjectRoleEntity() {
        super();
    }
    
    public ProjectRoleEntity(ProjectRoleEntity projectRole) {
        this.name = projectRole.getName();
        this.abbreviation = projectRole.getAbbreviation();
        this.permission = projectRole.getPermission();
        this.defaultRole = projectRole.isDefaultRole();
        this.icon = projectRole.getIcon();
        this.maxCount = projectRole.getMaxCount();
    }
    
    public ProjectRoleEntity(ProjectRole projectRole) {
        this.name = projectRole.getName();
        this.abbreviation = projectRole.getAbbreviation();
        this.permission = projectRole.getPermission().toString();
        this.defaultRole = projectRole.getDefaultRole();
        this.icon = projectRole.getIcon();
        this.maxCount = projectRole.getMaxCount();
    }

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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(final String permission) {
        this.permission = permission;
    }

    public boolean isDefaultRole() {
        return defaultRole;
    }

    public void setDefaultRole(final boolean defaultRole) {
        this.defaultRole = defaultRole;
    }

    public int getMaxCount() {
        return maxCount;
    }

    public void setMaxCount(int maxCount) {
        this.maxCount = maxCount;
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
