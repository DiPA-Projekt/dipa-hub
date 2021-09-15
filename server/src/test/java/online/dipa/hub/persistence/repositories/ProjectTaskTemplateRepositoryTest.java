package online.dipa.hub.persistence.repositories;

import static org.assertj.core.api.BDDAssertions.then;

import java.util.Optional;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import online.dipa.hub.persistence.entities.ProjectTaskTemplateEntity;
import online.dipa.hub.tenancy.CurrentTenantContextHolder;

@SpringBootTest
class ProjectTaskTemplateRepositoryTest {

    @Autowired
    private ProjectTaskTemplateRepository projectTaskTemplateRepository;

    @Nested
    class FindByMaster {

        @Test
        void should_return_when_master_template_exists() {
            CurrentTenantContextHolder.setTenantId("weit");

            // WHEN
            final Optional<ProjectTaskTemplateEntity> projectTaskTemplate = projectTaskTemplateRepository.findByMaster();

            // THEN
            then(projectTaskTemplate).get()
                                     .returns(1L, ProjectTaskTemplateEntity::getId)
                                     .returns(null, ProjectTaskTemplateEntity::getProject);
        }

        @Test
        void should_not_return_when_master_template_not_exists() {
            CurrentTenantContextHolder.setTenantId("ba");

            // WHEN
            final Optional<ProjectTaskTemplateEntity> projectTaskTemplate = projectTaskTemplateRepository.findByMaster();

            // THEN
            then(projectTaskTemplate).isEmpty();
        }

    }

}