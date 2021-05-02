package online.dipa.hub.persistence.entities;

import static javax.persistence.CascadeType.ALL;

import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "organisation_role")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OrganisationRoleEntity extends BaseEntity {
    
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

    
    @ManyToMany(mappedBy = "organisationRoles", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<UserEntity> users;

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

    public Set<UserEntity> getUsers() {
        return users;
    }

    public void setUsers(final Set<UserEntity> users) {
        this.users = users;
    }
   
}
