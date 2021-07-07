 package online.dipa.hub.persistence.repositories;

 import java.util.Optional;

 import org.junit.jupiter.api.Nested;
 import org.junit.jupiter.api.Test;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.boot.test.context.SpringBootTest;

 import online.dipa.hub.persistence.entities.PlanTemplateEntity;
 import online.dipa.hub.persistence.entities.ProjectApproachEntity;
 import static org.assertj.core.api.BDDAssertions.then;

 import javax.transaction.Transactional;

 @SpringBootTest
 @Transactional
 class PlanTemplateRepositoryTest {

     @Autowired
     private PlanTemplateRepository planTemplateRepository;

     @Autowired
     private ProjectApproachRepository projectApproachRepository;

     @Autowired
     private OperationTypeRepository operationTypeRepository;

     @Nested
     class FindByDefaultAndProjectApproach {

         @Test
         void should_return_when_default_template_exists() {
             // GIVEN
             final ProjectApproachEntity projectApproach = projectApproachRepository.findById(2L).get();

             // WHEN
             final Optional<PlanTemplateEntity> planTemplateEntity = planTemplateRepository.findByDefaultAndProjectApproach(projectApproach);

             // THEN
             then(planTemplateEntity).isNotEmpty().get()
                               .returns(3L, PlanTemplateEntity::getId)
                               .returns(null, PlanTemplateEntity::getProject);
         }

     }

     @Nested
     class FindByStandardAndProjectApproach {

         @Test
         void should_return_when_default_template_exists() {
             // GIVEN
             final ProjectApproachEntity projectApproach = projectApproachRepository.findById(3L).get();

             // WHEN
             final Optional<PlanTemplateEntity> planTemplateEntity = planTemplateRepository.findByDefaultAndProjectApproach(projectApproach);

             // THEN
             then(planTemplateEntity).isNotEmpty().get()
                                     .returns(4L, PlanTemplateEntity::getId)
                                     .returns(null, PlanTemplateEntity::getProject);
         }

     }

 }