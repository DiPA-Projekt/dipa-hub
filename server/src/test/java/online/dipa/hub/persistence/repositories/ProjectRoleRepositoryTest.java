 package online.dipa.hub.persistence.repositories;

 import static org.assertj.core.api.BDDAssertions.then;

 import java.util.Optional;

 import org.junit.jupiter.api.Nested;
 import org.junit.jupiter.api.Test;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.boot.test.context.SpringBootTest;

 import online.dipa.hub.persistence.entities.ProjectRoleEntity;
 import online.dipa.hub.persistence.entities.ProjectRoleTemplateEntity;

 @SpringBootTest
 class ProjectRoleRepositoryTest {

     @Autowired
     private ProjectRoleRepository projectRoleRepository;

     @Autowired
     private ProjectRoleTemplateRepository projectRoleTemplateRepository;

     @Nested
     class FindByTemplateAndAbbreviation {

         @Test
         void should_return_when_project_role_template_template_exists() {
             // GIVEN
             final ProjectRoleTemplateEntity projectRoleTemplate = projectRoleTemplateRepository.findById(1L).get();
             final String abbreviation = "PE";

             // WHEN
             final Optional<ProjectRoleEntity> projectTaskTemplate = projectRoleRepository.findByTemplateAndAbbreviation(projectRoleTemplate, abbreviation);

             // THEN
             then(projectTaskTemplate)
                     .isNotEmpty().get()
                     .returns("Projekteigner", ProjectRoleEntity::getName);
         }

         @Test
         void should_not_return_when_project_role_template_template_not_exists() {
             // GIVEN
             final ProjectRoleTemplateEntity projectRoleTemplate = projectRoleTemplateRepository.findById(1L).get();
             final String abbreviation = "OA";

             // WHEN
             final Optional<ProjectRoleEntity> projectTaskTemplate = projectRoleRepository.findByTemplateAndAbbreviation(projectRoleTemplate, abbreviation);

             // THEN
             then(projectTaskTemplate)
                     .isEmpty();
         }

     }

 }