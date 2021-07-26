package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;
import java.util.Collection;
import javax.persistence.QueryHint;

import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.entities.UserEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from UserEntity u where u.tenantId = :tenantId")
    Collection<UserEntity> findByTenantId(String tenantId);

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from UserEntity user join " +
            "user.projectRoles pRole join pRole.projectRoleTemplate pRoleTemplate " +
            "where pRoleTemplate.project = :project")
    Collection<UserEntity> findByProject(ProjectEntity project);

}
