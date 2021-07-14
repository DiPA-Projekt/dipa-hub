 package online.dipa.hub.services;

 import static org.assertj.core.api.BDDAssertions.then;
 import static org.mockito.ArgumentMatchers.any;
 import static org.mockito.BDDMockito.given;
 import static org.mockito.Mockito.verify;
 import static org.mockito.Mockito.when;

 import java.time.OffsetDateTime;
 import java.util.ArrayList;
 import java.util.List;
 import java.util.Optional;

 import javax.transaction.Transactional;

 import org.junit.jupiter.api.BeforeAll;
 import org.junit.jupiter.api.BeforeEach;
 import org.junit.jupiter.api.Nested;
 import org.junit.jupiter.api.Test;
 import org.junit.jupiter.api.extension.ExtendWith;
 import org.mockito.InjectMocks;
 import org.mockito.Mock;
 import org.mockito.junit.jupiter.MockitoExtension;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.boot.test.context.SpringBootTest;
 import static org.assertj.core.api.Assertions.*;

 import online.dipa.hub.api.model.PermanentProjectTask;
 import online.dipa.hub.persistence.entities.NonPermanentProjectTaskTemplateEntity;
 import online.dipa.hub.persistence.entities.PermanentProjectTaskEntity;
 import online.dipa.hub.persistence.entities.PermanentProjectTaskTemplateEntity;
 import online.dipa.hub.persistence.entities.ProjectEntity;
 import online.dipa.hub.persistence.entities.ProjectTaskEntity;
 import online.dipa.hub.persistence.entities.ProjectTaskTemplateEntity;
 import online.dipa.hub.persistence.repositories.FormFieldRepository;
 import online.dipa.hub.persistence.repositories.NonPermanentProjectTaskRepository;
 import online.dipa.hub.persistence.repositories.NonPermanentProjectTaskTemplateRepository;
 import online.dipa.hub.persistence.repositories.OptionEntryEntityRepository;
 import online.dipa.hub.persistence.repositories.PermanentProjectTaskRepository;
 import online.dipa.hub.persistence.repositories.PermanentProjectTaskTemplateRepository;
 import online.dipa.hub.persistence.repositories.ProjectRepository;
 import online.dipa.hub.persistence.repositories.ProjectTaskRepository;
 import online.dipa.hub.persistence.repositories.ProjectTaskTemplateRepository;
 import online.dipa.hub.persistence.repositories.ResultRepository;

 @SpringBootTest
 @Transactional
 class ProjectServiceTest {

     @Mock
     private ProjectTaskTemplateRepository projectTaskTemplateRepository;

     @Mock
     private ProjectTaskRepository projectTaskRepository;

     @Mock
     private PermanentProjectTaskRepository permanentProjectTaskRepository;

     @Mock
     private PermanentProjectTaskTemplateRepository permanentProjectTaskTempRep;

     @Mock
     private NonPermanentProjectTaskRepository nonPermanentProjectTaskRepository;

     @Mock
     private NonPermanentProjectTaskTemplateRepository nonPermanentProjectTaskTempRep;

     @Mock
     private FormFieldRepository formFieldRepository;

     @Mock
     private OptionEntryEntityRepository optionEntryRepository;

     @Mock
     private ResultRepository resultRepository;

     @Mock
     private ProjectRepository projectRepository;

     @InjectMocks
     private ProjectService projectService;

     @Mock
     private UserInformationService userInformationService;

     ProjectEntity project;
     ProjectTaskEntity projectTask;
     ProjectTaskEntity newProjectTask;
     PermanentProjectTaskTemplateEntity permanentProjectTaskTemp;
     NonPermanentProjectTaskTemplateEntity nonPermanentProjectTaskTemp;

     @BeforeEach
     public void setUp() {
         projectRepository.deleteAll();

         project = new ProjectEntity("Test Project",
                 "SMALL", "internes Projekt", OffsetDateTime.now(), OffsetDateTime.now().plusDays(30), false);
         project.setId(1L);
         projectRepository.save(project);

         ProjectTaskTemplateEntity projectTaskTemplate = new ProjectTaskTemplateEntity
                 ("Test Temp", false, project);
         projectTaskTemplateRepository.save(projectTaskTemplate);
         System.out.println(projectTaskTemplateRepository.findById(projectTaskTemplate.getId()));

         permanentProjectTaskTemp = new PermanentProjectTaskTemplateEntity
                 ("Test Permanent Temp", false, project);
         permanentProjectTaskTempRep.save(permanentProjectTaskTemp);

         nonPermanentProjectTaskTemp = new NonPermanentProjectTaskTemplateEntity
                 ("Test Non Permanent Temp", false, project);
         nonPermanentProjectTaskTempRep.save(nonPermanentProjectTaskTemp);

         project.setProjectTaskTemplate(projectTaskTemplate);
         project.setPermanentProjectTaskTemplate(permanentProjectTaskTemp);
         project.setNonPermanentProjectTaskTemplate(nonPermanentProjectTaskTemp);
         projectRepository.save(project);

         projectTask = new ProjectTaskEntity(true, "Test Explanation", true, 1L);
         projectTask.setProjectTaskTemplate(projectTaskTemplate);
         projectTaskRepository.save(projectTask);
         System.out.println(projectTaskRepository.findById(projectTask.getId()));
         newProjectTask = new ProjectTaskEntity(true, "New Explanation", true, 1L);


         System.out.println("project.getPermanentProjectTaskTemplate()");

         System.out.println(project.getPermanentProjectTaskTemplate());
         PermanentProjectTaskEntity permanentProjectTask1 = new PermanentProjectTaskEntity("Test Permanent Task1", null, 1L);
         PermanentProjectTaskEntity permanentProjectTask2 = new PermanentProjectTaskEntity("Test Permanent Task2", null, 2L);
         permanentProjectTask1.setProjectTask(projectTask);
         permanentProjectTask1.setPermanentProjectTaskTemplate(permanentProjectTaskTemp);
         permanentProjectTaskRepository.save(permanentProjectTask1);
         System.out.println(permanentProjectTaskRepository.findById(permanentProjectTask1.getId()));
     }


     @Nested
     class GetPermanentProjectTasks {

         @Test
         void should_return_permanent_project_tasks() {
             // GIVEN
             PermanentProjectTaskEntity permanentProjectTask = new PermanentProjectTaskEntity
                     ("Test Permanent Task", null, 2L);
             List<Long> projectIds = new ArrayList<>();
             projectIds.add(project.getId());
             System.out.println(projectIds);

             when(projectRepository.getById(project.getId())).thenReturn(project);
             when(userInformationService.getProjectIdList()).thenReturn(projectIds);
             System.out.println(userInformationService.getProjectIdList());
             System.out.println(projectRepository.getById(project.getId()));

             //             projectTask.setPermanentProjectTask(permanentProjectTask);
//             PermanentProjectTaskEntity newPermanentProjectTask = new PermanentProjectTaskEntity(projectTask.getPermanentProjectTask());
//             permanentProjectTask.setPermanentProjectTaskTemplate(permanentProjectTaskTemp);
//             permanentProjectTask.setProjectTask(newProjectTask);
//             PermanentProjectTaskEntity newPermanentProjectTask = new PermanentProjectTaskEntity
//                     ("Test Permanent Task", null, 2L);
//             when(permanentProjectTaskRepository.save(permanentProjectTask)).thenReturn(null);

//             NonPermanentProjectTaskEntity newNonPermanentProjectTask = new NonPermanentProjectTaskEntity
//                     ("Test Non Permanent Task", null, 2L);
//             when(nonPermanentProjectTaskRepository.save(newNonPermanentProjectTask)).thenReturn(null);
//             projectTask.setPermanentProjectTask(permanentProjectTask);
//             projectTask.setNonPermanentProjectTask(newNonPermanentProjectTask);

             // WHEN
             List<PermanentProjectTask> permanentProjectTasks = projectService.getPermanentProjectTasks(1L);

             // THEN
             assertThat(permanentProjectTasks).hasSize(1);
             System.out.println(permanentProjectTasks);
//             verify(permanentProjectTaskRepository).save(any(PermanentProjectTaskEntity.class));
//             verify(nonPermanentProjectTaskRepository).save(any(NonPermanentProjectTaskEntity.class));

         }

         @Test
         void should_not_return_when_project_role_template_template_not_exists() {
             // GIVEN
//             final ProjectRoleTemplateEntity projectRoleTemplate = projectRoleTemplateRepository.findById(1L).get();
//             final String abbreviation = "OA";
//
//             // WHEN
//             final Optional<ProjectRoleEntity> projectTaskTemplate = projectRoleRepository.findByTemplateAndAbbreviation(projectRoleTemplate, abbreviation);
//
//             // THEN
//             then(projectTaskTemplate)
//                     .isEmpty();
         }

     }

 }