package online.dipa.hub.persistence.repositories;


import static org.hibernate.jpa.QueryHints.HINT_CACHEABLE;

import java.util.Optional;

import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import online.dipa.hub.persistence.entities.ProjectPropertyQuestionTemplateEntity;

public interface ProjectPropertyQuestionTemplateRepository extends JpaRepository<ProjectPropertyQuestionTemplateEntity, Long> {

    @QueryHints(value = { @QueryHint(name = HINT_CACHEABLE, value = "true") })
    @Query("from ProjectPropertyQuestionTemplateEntity p where p.master = true")
    Optional<ProjectPropertyQuestionTemplateEntity> findByMaster();


}
