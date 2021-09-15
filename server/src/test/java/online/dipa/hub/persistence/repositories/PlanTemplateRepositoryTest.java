package online.dipa.hub.persistence.repositories;

import static org.assertj.core.api.BDDAssertions.then;

import java.util.Optional;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import online.dipa.hub.persistence.entities.PlanTemplateEntity;
import online.dipa.hub.persistence.entities.ProjectApproachEntity;
import online.dipa.hub.tenancy.CurrentTenantContextHolder;

@SpringBootTest
@Transactional
class PlanTemplateRepositoryTest {

    @Autowired
    private PlanTemplateRepository planTemplateRepository;

    @Autowired
    private ProjectApproachRepository projectApproachRepository;

    @Autowired
    private OperationTypeRepository operationTypeRepository;

    @BeforeAll
    static void setUpContext() {
        CurrentTenantContextHolder.setTenantId("weit");
    }

    @Nested
    class FindByDefaultAndProjectApproach {

        @Test
        void should_return_when_default_template_exists() {
            // GIVEN
            final ProjectApproachEntity projectApproach = projectApproachRepository.findById(2L)
                                                                                   .get();

            // WHEN
            final Optional<PlanTemplateEntity> planTemplateEntity = planTemplateRepository.findByDefaultAndProjectApproach(
                    projectApproach);

            // THEN
            then(planTemplateEntity).isNotEmpty()
                                    .get()
                                    .returns(3L, PlanTemplateEntity::getId)
                                    .returns(null, PlanTemplateEntity::getProject);
        }

        @Test
        void should_not_return_when_default_template_not_exists() {
            // GIVEN
            final ProjectApproachEntity projectApproach = new ProjectApproachEntity();
            projectApproach.setName("testProjectApproach");
            operationTypeRepository.findById(2L)
                                   .ifPresent(projectApproach::setOperationType);
            projectApproachRepository.save(projectApproach);

            // WHEN
            final Optional<PlanTemplateEntity> planTemplateEntity = planTemplateRepository.findByDefaultAndProjectApproach(
                    projectApproach);

            // THEN
            then(planTemplateEntity).isEmpty();
        }

    }

    @Nested
    class FindByStandardAndProjectApproach {

        @Test
        void should_return_when_standard_template_exists() {
            // GIVEN
            final ProjectApproachEntity projectApproach = projectApproachRepository.findById(3L)
                                                                                   .get();

            // WHEN
            final Optional<PlanTemplateEntity> planTemplateEntity = planTemplateRepository.findByStandardAndProjectApproach(
                    projectApproach);

            // THEN
            then(planTemplateEntity).isNotEmpty()
                                    .get()
                                    .returns(4L, PlanTemplateEntity::getId)
                                    .returns(null, PlanTemplateEntity::getProject);
        }

        @Test
        void should_not_return_when_standard_template_not_exists() {
            // GIVEN
            final ProjectApproachEntity projectApproach = new ProjectApproachEntity();
            projectApproach.setName("testProjectApproach");
            operationTypeRepository.findById(2L)
                                   .ifPresent(projectApproach::setOperationType);
            projectApproachRepository.save(projectApproach);

            // WHEN
            final Optional<PlanTemplateEntity> planTemplateEntity = planTemplateRepository.findByStandardAndProjectApproach(
                    projectApproach);

            // THEN
            then(planTemplateEntity).isEmpty();
        }

    }

}