 package online.dipa.hub.persistence.repositories;

 import static org.assertj.core.api.BDDAssertions.then;

 import java.util.Optional;

 import org.junit.jupiter.api.Nested;
 import org.junit.jupiter.api.Test;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.boot.test.context.SpringBootTest;

 import online.dipa.hub.persistence.entities.ProjectApproachEntity;
 import online.dipa.hub.tenancy.CurrentTenantContextHolder;

 @SpringBootTest
 class ProjectApproachRepositoryTest {

     @Autowired
     private ProjectApproachRepository projectApproachRepository;

     @Nested
     class GetOneProjectApproach {

         @Test
         void should_return_one_project_approach_itzbund() {
//             // GIVEN
             CurrentTenantContextHolder.setTenantId("itzbund");

             // WHEN
             final Optional<ProjectApproachEntity> projectApproachEntity = projectApproachRepository.getOneProjectApproachEntity();

             // THEN
             then(projectApproachEntity)
                     .isNotEmpty().get()
                     .returns(2L, ProjectApproachEntity::getId);
         }

         @Test
         void should_return_one_project_approach_ba() {
             //             // GIVEN
             CurrentTenantContextHolder.setTenantId("ba");

             // WHEN
             final Optional<ProjectApproachEntity> projectApproachEntity = projectApproachRepository.getOneProjectApproachEntity();

             // THEN
             then(projectApproachEntity)
                     .isNotEmpty().get()
                     .returns(1L, ProjectApproachEntity::getId);
         }

     }

 }