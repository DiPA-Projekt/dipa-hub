package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;
import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.persistence.entities.ProjectRoleTemplateEntity;

public interface ProjectRoleTemplateRepository extends JpaRepository<ProjectRoleTemplateEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from ProjectRoleTemplateEntity as pr join pr.projectApproaches as approach where approach = :projectApproach")
    ProjectRoleTemplateEntity findByProjectApproach(ProjectApproachEntity projectApproach);

}
