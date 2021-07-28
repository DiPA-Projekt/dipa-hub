package online.dipa.hub.persistence.repositories;

import static org.assertj.core.api.BDDAssertions.then;

import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import online.dipa.hub.persistence.entities.ProjectPropertyQuestionEntity;
import online.dipa.hub.persistence.entities.ProjectPropertyQuestionTemplateEntity;
import online.dipa.hub.tenancy.CurrentTenantContextHolder;

@SpringBootTest
class ProjectPropertyQuestionRepositoryTest {

    @Autowired
    private ProjectPropertyQuestionTemplateRepository projectPropertyQuestionTemplateRepository;

    @Autowired
    private ProjectPropertyQuestionRepository projectPropertyQuestionRepository;

    @BeforeAll
    static void setUpContext() {
        CurrentTenantContextHolder.setTenantId("itzbund");
    }

    @Nested
    class FindByTemplateAndSortOrder {

        @Test
        void should_return_when_question_exists() {
            // GIVEN
            final ProjectPropertyQuestionTemplateEntity template = projectPropertyQuestionTemplateRepository
                    .findByMaster().get();
            final int sortOrder = 2;

            // WHEN
            final Optional<ProjectPropertyQuestionEntity> propertyQuestion = projectPropertyQuestionRepository
                    .findByTemplateAndSortOrder(template, sortOrder);

            // THEN
            then(propertyQuestion)
                    .isNotEmpty().get()
                    .returns(sortOrder, ProjectPropertyQuestionEntity::getSortOrder)
                    .returns("Arbeitest du mit weiteren Projektteammitgliedern zusammen?", ProjectPropertyQuestionEntity::getQuestion);
        }

        @Test
        void should_not_return_when_question_not_exists() {
            // GIVEN
            final ProjectPropertyQuestionTemplateEntity template = projectPropertyQuestionTemplateRepository
                    .findByMaster().get();
            final int sortOrder = 100;

            // WHEN
            final Optional<ProjectPropertyQuestionEntity> propertyQuestion = projectPropertyQuestionRepository
                    .findByTemplateAndSortOrder(template, sortOrder);

            // THEN
            then(propertyQuestion)
                    .isEmpty();
        }

    }

}