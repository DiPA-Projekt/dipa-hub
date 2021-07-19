 package online.dipa.hub.services;
 import javax.transaction.Transactional;

 import org.junit.jupiter.api.BeforeEach;
 import org.junit.jupiter.api.Nested;
 import org.junit.jupiter.api.Test;

 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.boot.test.context.SpringBootTest;
 import org.springframework.boot.test.mock.mockito.MockBean;
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
 import java.util.Collections;
 import java.util.List;
 import java.util.Objects;

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
        testProject.setProjectSize("SMALL");
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

    @Nested
    class CreatePermanentProjectTasks {
        ProjectTaskTemplateEntity projectTaskProject;
        PermanentProjectTaskTemplateEntity permanentProjectTaskTemp;
        NonPermanentProjectTaskTemplateEntity nonPermanentProjectTaskTemp;

        @BeforeEach
        void setUp() {
            projectTaskProject = new
                    ProjectTaskTemplateEntity("Project Task Template " + testProject.getName(), false, testProject);
            projectTaskTemplateRepository.save(projectTaskProject);

            permanentProjectTaskTemp = new
                    PermanentProjectTaskTemplateEntity("Permanent Project Task Template " + testProject.getName(), false, testProject);

            nonPermanentProjectTaskTemp = new
                    NonPermanentProjectTaskTemplateEntity("Non Permanent Project Task Template " + testProject.getName(), false, testProject);

        }

        @Test
        void should_create_non_permanent_project_task() {
            // GIVEN
            ProjectTaskEntity projectTaskTemp = new ArrayList<>(Objects.requireNonNull(projectTaskTemplateRepository.findByMaster().orElse(null))
                                                                        .getProjectTasks()).stream().filter(p -> p.getNonPermanentProjectTask()!= null).findFirst().get();
            ProjectTaskEntity newProjectTask = new ProjectTaskEntity(projectTaskTemp);
            newProjectTask.setProjectTaskTemplate(projectTaskProject);

            projectTaskRepository.save(newProjectTask);

            //WHEN
            projectService.createPermanentProjectTasks(projectTaskTemp, newProjectTask, permanentProjectTaskTemp, nonPermanentProjectTaskTemp);

            // THEN
            assertThat(nonPermanentProjectTaskTemp.getNonPermanentProjectTasks()).hasSize(1);
            assertThat(new ArrayList<>(nonPermanentProjectTaskTemp.getNonPermanentProjectTasks()).get(0).getTitle())
                    .isEqualTo(projectTaskTemp.getNonPermanentProjectTask().getTitle());

        }


        @Test
        void should_create_permanent_project_task() {
            // GIVEN
            ProjectTaskTemplateEntity projectTaskProject = new
                    ProjectTaskTemplateEntity("Project Task Template " + testProject.getName(), false, testProject);
            projectTaskTemplateRepository.save(projectTaskProject);

            ProjectTaskEntity projectTaskTemp = new ArrayList<>(Objects.requireNonNull(projectTaskTemplateRepository.findByMaster().orElse(null))
                                                                       .getProjectTasks()).stream().filter(p -> p.getPermanentProjectTask()!= null).findFirst().get();
            ProjectTaskEntity newProjectTask = new ProjectTaskEntity(projectTaskTemp);
            newProjectTask.setProjectTaskTemplate(projectTaskProject);

            projectTaskRepository.save(newProjectTask);

            //WHEN
            projectService.createPermanentProjectTasks(projectTaskTemp, newProjectTask, permanentProjectTaskTemp, nonPermanentProjectTaskTemp);

            // THEN
            assertThat(permanentProjectTaskTemp.getPermanentProjectTasks()).hasSize(1);
            assertThat(new ArrayList<>(permanentProjectTaskTemp.getPermanentProjectTasks()).get(0).getTitle())
                    .isEqualTo(projectTaskTemp.getPermanentProjectTask().getTitle());

    @Nested
    class GetProjectTasks {

        @Test
        void should_return_permanent_project_tasks() {
            // GIVEN
            when(userInformationService.getProjectIdList()).thenReturn(new ArrayList<Long>(
                    Collections.singleton(testProject.getId())));

            //WHEN
            List<PermanentProjectTask> permanentProjectTasks = projectService.getPermanentProjectTasks(testProject.getId());

            // THEN
            System.out.println(permanentProjectTasks);
            assertThat(permanentProjectTasks).isNotEmpty().hasSize(11);

        @Test
        void should_return_non_permanent_project_task() {
            // GIVEN
            when(userInformationService.getProjectIdList()).thenReturn(new ArrayList<Long>(
                    Collections.singleton(testProject.getId())));

            //WHEN
            List<NonPermanentProjectTask> nonPermanentProjectTasks = projectService.getNonPermanentProjectTasks(testProject.getId());

            // THEN
            assertThat(nonPermanentProjectTasks).isNotEmpty().hasSize(13);

        }
    }

 }
