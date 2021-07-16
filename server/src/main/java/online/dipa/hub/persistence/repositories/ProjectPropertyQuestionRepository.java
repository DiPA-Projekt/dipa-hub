package online.dipa.hub.persistence.repositories;

import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;

import java.util.Collection;
import java.util.Optional;

import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.ProjectPropertyQuestionEntity;
import online.dipa.hub.persistence.entities.ProjectPropertyQuestionTemplateEntity;

public interface ProjectPropertyQuestionRepository extends JpaRepository<ProjectPropertyQuestionEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from ProjectPropertyQuestionEntity p where p.projectPropertyQuestionTemplate = :template and p.sortOrder = :sortOrder")
    Optional<ProjectPropertyQuestionEntity> findByTemplateAndSortOrder(ProjectPropertyQuestionTemplateEntity template, int sortOrder);

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from ProjectPropertyQuestionEntity p where p.projectPropertyQuestionTemplate = :template")
    Collection<ProjectPropertyQuestionEntity> findByTemplate(ProjectPropertyQuestionTemplateEntity template);
}
