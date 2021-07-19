 package online.dipa.hub.services;
 import javax.transaction.Transactional;

 import org.junit.jupiter.api.BeforeEach;
 import org.junit.jupiter.api.Nested;
 import org.junit.jupiter.api.Test;

 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.boot.test.context.SpringBootTest;
 import org.springframework.core.convert.ConversionService;

 import online.dipa.hub.api.model.PropertyQuestion;
 import online.dipa.hub.persistence.entities.ProjectEntity;
 import online.dipa.hub.persistence.entities.ProjectPropertyQuestionEntity;
 import online.dipa.hub.persistence.entities.ProjectPropertyQuestionTemplateEntity;
 import online.dipa.hub.persistence.repositories.ProjectApproachRepository;
 import online.dipa.hub.persistence.repositories.ProjectPropertyQuestionRepository;
 import online.dipa.hub.persistence.repositories.ProjectRepository;

 import static org.assertj.core.api.Assertions.*;
 import java.util.ArrayList;

 @SpringBootTest
 @Transactional
 class ProjectServiceTest {

     @Autowired
     private ProjectApproachRepository projectApproachRepository;

     @Autowired
     private ProjectRepository projectRepository;

     @Autowired
     private ProjectPropertyQuestionRepository projectPropertyQuestionRepository;

     @Autowired
     private ProjectService projectService;

     @Autowired
     private ConversionService conversionService;


     ProjectEntity testProject;

    @BeforeEach
    void setUp() {
        testProject = new ProjectEntity();
        testProject.setName("Test Project");
        testProject.setProjectApproach(projectApproachRepository.getById(2L));
        projectRepository.save(testProject);
    }

     @Nested
     class CreateNewPropertyQuestions {

         @Test
         void should_return_when_template_created() {
             // WHEN
             ProjectPropertyQuestionTemplateEntity template = projectService.createNewPropertyQuestions(testProject);

             // THEN
             assertThat(template)
                     .returns("Property Question Template Test Project", ProjectPropertyQuestionTemplateEntity::getName)
                     .returns(testProject, ProjectPropertyQuestionTemplateEntity::getProject);
             assertThat(template.getProjectPropertyQuestions())
                     .hasSize(2);

         }

     }

     @Nested
     class UpdatePropertyQuestions {
         ProjectPropertyQuestionTemplateEntity template;

         @BeforeEach
         void setUp() {
             template = projectService.createNewPropertyQuestions(testProject);
         }

         @Test
         void should_return_false_as_selected_value() {
             // GIVEN
             ProjectPropertyQuestionEntity propertyQuestionEntity = new ArrayList<>(
                     template.getProjectPropertyQuestions()).get(0);
             PropertyQuestion propertyQuestionAPI = conversionService.convert(propertyQuestionEntity, PropertyQuestion.class);
             assert propertyQuestionAPI != null;
             propertyQuestionAPI.setSelected(false);

             //WHEN
             projectService.updateProjectPropertyQuestion(propertyQuestionAPI);

             // THEN
             assertThat(propertyQuestionEntity)
                     .returns(false, ProjectPropertyQuestionEntity::getSelected);

         }

         @Test
         void should_return_true_as_selected_value() {
             // GIVEN
             ProjectPropertyQuestionEntity propertyQuestionEntity = new ArrayList<>(
                     template.getProjectPropertyQuestions()).get(0);
             PropertyQuestion propertyQuestionAPI = conversionService.convert(propertyQuestionEntity, PropertyQuestion.class);
             assert propertyQuestionAPI != null;
             propertyQuestionAPI.setSelected(false);

             //WHEN
             projectService.updateProjectPropertyQuestion(propertyQuestionAPI);

             // THEN
             assertThat(propertyQuestionEntity)
                     .returns(false, ProjectPropertyQuestionEntity::getSelected);

         }

     }


 }