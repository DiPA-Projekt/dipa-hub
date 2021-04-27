package online.dipa.hub.persistence.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import static javax.persistence.CascadeType.ALL;

@Entity
@Table(name = "user")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    private String name;

    @NotNull
    @Basic(optional = false)
    private String email;

    @ManyToMany(mappedBy = "users", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ProjectRoleEntity> projectRoles = new HashSet<>();


}
