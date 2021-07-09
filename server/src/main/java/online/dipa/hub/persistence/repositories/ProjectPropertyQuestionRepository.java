package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;

import java.util.Collection;

import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.entities.ProjectPropertyQuestionEntity;

public interface ProjectPropertyQuestionRepository extends JpaRepository<ProjectPropertyQuestionEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from ProjectPropertyQuestionEntity p where p.project = :project")
    Collection<ProjectPropertyQuestionEntity> findByProject(ProjectEntity project);
}
