package online.dipa.hub.persistence.repositories;

import static org.assertj.core.api.BDDAssertions.then;

import java.util.Optional;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import online.dipa.hub.persistence.entities.ProjectPropertyQuestionTemplateEntity;
import online.dipa.hub.tenancy.CurrentTenantContextHolder;

@SpringBootTest
class ProjectPropertyQuestionTemplateRepositoryTest {

    @Autowired
    private ProjectPropertyQuestionTemplateRepository projectPropertyQuestionTemplateRepository;

    @Nested
    class FindByMaster {

        @Test
        void should_return_when_template_exists() {
            // GIVEN
            CurrentTenantContextHolder.setTenantId("itzbund");

            // WHEN
            final Optional<ProjectPropertyQuestionTemplateEntity> projectPropertyQuestionTemplate =
                    projectPropertyQuestionTemplateRepository.findByMaster();

            // THEN
            then(projectPropertyQuestionTemplate)
                    .isNotEmpty().get()
                    .returns(null, ProjectPropertyQuestionTemplateEntity::getProject);
        }

        @Test
        void should_not_return_when_template_not_exists() {
            // GIVEN
            CurrentTenantContextHolder.setTenantId("ba");

            // WHEN
            final Optional<ProjectPropertyQuestionTemplateEntity> projectPropertyQuestionTemplate =
                    projectPropertyQuestionTemplateRepository.findByMaster();

            // THEN
            then(projectPropertyQuestionTemplate)
                    .isEmpty();
        }

    }

}