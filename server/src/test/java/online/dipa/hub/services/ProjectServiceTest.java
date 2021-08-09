 package online.dipa.hub.services;
 import javax.transaction.Transactional;

 import org.junit.jupiter.api.BeforeAll;
 import org.junit.jupiter.api.BeforeEach;
 import org.junit.jupiter.api.Nested;
 import org.junit.jupiter.api.Test;

 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.boot.test.context.SpringBootTest;
 import org.springframework.boot.test.mock.mockito.MockBean;
 import org.springframework.core.convert.ConversionService;

 import online.dipa.hub.api.model.NonPermanentProjectTask;
 import online.dipa.hub.api.model.PermanentProjectTask;
 import online.dipa.hub.api.model.ProjectEventTemplate;
 import online.dipa.hub.api.model.PropertyQuestion;
 import online.dipa.hub.persistence.entities.*;
 import online.dipa.hub.persistence.repositories.NonPermanentProjectTaskRepository;
 import online.dipa.hub.persistence.repositories.PermanentProjectTaskRepository;
 import online.dipa.hub.persistence.repositories.ProjectApproachRepository;
 import online.dipa.hub.persistence.repositories.ProjectRepository;
 import online.dipa.hub.persistence.repositories.ProjectTaskRepository;
 import online.dipa.hub.persistence.repositories.ProjectTaskTemplateRepository;
 import online.dipa.hub.tenancy.CurrentTenantContextHolder;

 import static org.assertj.core.api.Assertions.*;
 import static org.mockito.Mockito.when;
 import static org.assertj.core.api.BDDAssertions.then;

 import java.time.DayOfWeek;
 import java.time.OffsetDateTime;
 import java.util.ArrayList;
 import java.util.Collections;
 import java.util.List;
 import java.util.Objects;
 import java.util.TimeZone;
 import java.util.stream.Collectors;

 @SpringBootTest
 @Transactional
 class ProjectServiceTest {

    @Autowired
    private ProjectApproachRepository projectApproachRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ProjectTaskTemplateRepository projectTaskTemplateRepository;

    @Autowired
    private ProjectTaskRepository projectTaskRepository;


    @Autowired
    private NonPermanentProjectTaskRepository nonPermanentProjectTaskRepository;

    @Autowired
    private PermanentProjectTaskRepository permanentProjectTaskRepository;

    @MockBean
    private UserInformationService userInformationService;

    ProjectEntity testProject = new ProjectEntity();

    @BeforeAll
    static void setUpContext() {
        CurrentTenantContextHolder.setTenantId("itzbund");
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

    }

    private void createProject (ProjectEntity newProject, OffsetDateTime startDate, OffsetDateTime endDate) {
        newProject.setName("Test Project");
        newProject.setProjectApproach(projectApproachRepository.getById(2L));
        newProject.setProjectSize("SMALL");
        newProject.setStartDate(startDate);
        newProject.setEndDate(endDate);
        projectRepository.save(newProject);
    }

    @BeforeEach
    void setUp() {
        CurrentTenantContextHolder.setTenantId("itzbund");
        OffsetDateTime today = OffsetDateTime.now().withDayOfMonth(6);

        createProject(testProject, today.minusMonths(5L), today.plusMonths(4L));
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
        }

    }

    @Nested
    class GetProjectTasks {

        @Test
        void should_return_permanent_project_tasks() {
            // GIVEN
            when(userInformationService.getProjectIdList()).thenReturn(new ArrayList<>(Collections.singleton(testProject.getId())));

            //WHEN
            List<PermanentProjectTask> permanentProjectTasks = projectService.getPermanentProjectTasks(testProject.getId());

            // THEN
            assertThat(permanentProjectTasks).isNotEmpty()
                                             .hasSize(11);
        }

        @Test
        void should_return_non_permanent_project_task() {
            // GIVEN
            when(userInformationService.getProjectIdList()).thenReturn(new ArrayList<>(Collections.singleton(testProject.getId())));

            //WHEN
            List<NonPermanentProjectTask> nonPermanentProjectTasks = projectService.getNonPermanentProjectTasks(testProject.getId());

            // THEN
            assertThat(nonPermanentProjectTasks).isNotEmpty().hasSize(13);

        }

    }

     @Nested
     class SortOrderProjectTasks {

         @Test
         void should_return_new_sort_order_permanent_project_tasks() {
             // GIVEN
             when(userInformationService.getProjectIdList()).thenReturn(new ArrayList<>(Collections.singleton(testProject.getId())));

             List<PermanentProjectTask> projectTasks = projectService.getPermanentProjectTasks(testProject.getId());
             projectTasks.get(0).setSortOrder(2L);
             projectTasks.get(1).setSortOrder(1L);

             //WHEN
             projectService.updatePermanentProjectTasks(projectTasks);

             // THEN
             then(permanentProjectTaskRepository.getById(projectTasks.get(0).getId())).returns(2L, PermanentProjectTaskEntity::getSortOrder);
             then(permanentProjectTaskRepository.getById(projectTasks.get(1).getId())).returns(1L, PermanentProjectTaskEntity::getSortOrder);
         }


         @Test
         void should_return_new_sort_order_non_permanent_project_tasks() {
             // GIVEN
             when(userInformationService.getProjectIdList()).thenReturn(new ArrayList<>(Collections.singleton(testProject.getId())));

             List<NonPermanentProjectTask> projectTasks = projectService.getNonPermanentProjectTasks(testProject.getId());
             projectTasks.get(0).setSortOrder(2L);
             projectTasks.get(1).setSortOrder(1L);

             //WHEN
             projectService.updateNonPermanentProjectTasks(projectTasks);

             // THEN
             then(nonPermanentProjectTaskRepository.getById(projectTasks.get(0).getId())).returns(2L, NonPermanentProjectTaskEntity::getSortOrder);
             then(nonPermanentProjectTaskRepository.getById(projectTasks.get(1).getId())).returns(1L, NonPermanentProjectTaskEntity::getSortOrder);

         }
     }

     @Nested
     class RecurringEvents {

         @Test
         void should_create_recurring_event_types() {
             // GIVEN
             projectService.initializeProjectTasks(testProject.getId());

             //WHEN
             projectService.createRecurringEventTypes(testProject);

             // THEN
             List<RecurringEventTypeEntity> recurringEventTypes = new ArrayList<>(testProject.getRecurringEventTypes());
             assertThat(recurringEventTypes).isNotEmpty().hasSize(4);

             recurringEventTypes.forEach(t -> assertThat(t.getRecurringEventPattern())
                     .returns("FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=1", RecurringEventPatternEntity::getRulePattern)
                     .returns(testProject.getStartDate().toLocalDate(), RecurringEventPatternEntity::getStartDate)
                     .returns(testProject.getEndDate().toLocalDate(), RecurringEventPatternEntity::getEndDate));
         }

         @Test
         void should_create_recurring_events() {
             // GIVEN
             projectService.initializeProjectTasks(testProject.getId());
             projectService.createRecurringEventTypes(testProject);

             //WHEN
             projectService.initializeRecurringEvents(testProject);

             // THEN
             List<ProjectEventTemplateEntity> eventTemplates = testProject.getEventTemplates()
                                                                          .stream()
                                                                          .filter(e -> e.getEventType()
                                                                                .equals("TYPE_RECURRING_EVENT")).collect(
                             Collectors.toList());

             assertThat(eventTemplates).isNotEmpty().hasSize(4);
             eventTemplates.forEach(t -> assertThat(t)
                     .returns("TYPE_RECURRING_EVENT", ProjectEventTemplateEntity::getEventType));

             eventTemplates.forEach(t -> assertThat(t.getProjectEvents()).hasSize(9));
             ProjectEventTemplateEntity eventTemplate = eventTemplates.get(0);
             eventTemplate.getProjectEvents().forEach(e -> assertThat(e.getDateTime().getDayOfMonth()).isEqualTo(10));

         }

         @Test
         void should_return_events() {
             // GIVEN
             projectService.initializeProjectTasks(testProject.getId());
             projectService.createRecurringEventTypes(testProject);

             //WHEN
             List<ProjectEventTemplate> eventTemplates = projectService.getEvents(testProject.getId());

             // THEN
             assertThat(eventTemplates).isNotEmpty();

         }

         @Test
         void should_update_recurring_events_based_on_pQuestions() {
             // GIVEN
             projectService.initializeProjectTasks(testProject.getId());
             projectService.createRecurringEventTypes(testProject);
             projectService.initializeRecurringEvents(testProject);
             ProjectPropertyQuestionEntity propertyQuestion = testProject.getProjectPropertyQuestionTemplate().getProjectPropertyQuestions()
                        .stream().filter(q -> q.getSortOrder() == 1).findFirst().get();

             propertyQuestion.setSelected(false);

             //WHEN
             projectService.updateRecurringEventsBasedOnPQuestions(propertyQuestion);

             // THEN
             assertThat(testProject.getEventTemplates()).hasSize(2);

         }

         @Test
         void should_create_event_template_for_recurring_type() {
             // GIVEN
             projectService.initializeProjectTasks(testProject.getId());
             projectService.createRecurringEventTypes(testProject);
             RecurringEventTypeEntity eventType = testProject.getRecurringEventTypes().stream().findFirst().get();

             //WHEN
             projectService.createEventTemplates(testProject, eventType, null);

             // THEN
             assertThat(eventType.getProjectEventTemplate()).isNotNull();
             assertThat(eventType.getProjectEventTemplate())
                     .returns("TYPE_RECURRING_EVENT",ProjectEventTemplateEntity::getEventType)
             .returns("Wiederkehrende Termine " + eventType.getTitle(),ProjectEventTemplateEntity::getTitle);

         }

     }

     @Nested
     class UpdateRecurringEvents {

        @BeforeEach
        void setUp() {
            // GIVEN
            projectService.initializeProjectTasks(testProject.getId());
            projectService.createRecurringEventTypes(testProject);
            projectService.initializeRecurringEvents(testProject);
        }

         @Test
         void should_delete_events_after_newEndDate() {

             //WHEN
             OffsetDateTime newEndDate = OffsetDateTime.now().withDayOfMonth(6).minusMonths(2L);
             projectService.updateRecurringEventsBasedOnEndDate(testProject, newEndDate);

             // THEN
             testProject.getEventTemplates().forEach(t -> assertThat(t.getProjectEvents()).hasSize(3));

         }

         @Test
         void should_update_events_endDate_in_future() {
             // GIVEN
             // WHEN
             OffsetDateTime newEndDate = OffsetDateTime.now().withDayOfMonth(6).plusMonths(6L);
             testProject.getRecurringEventTypes()
                        .forEach(t -> t.getRecurringEventPattern()
                                       .setEndDate(newEndDate.toLocalDate()));
             projectService.updateRecurringEventsBasedOnEndDate(testProject, newEndDate);

             // THEN
             testProject.getEventTemplates().forEach(t -> assertThat(t.getProjectEvents()).hasSize(11));

         }

         @Test
         void should_update_events_startDate_in_the_future() {
             //WHEN
             OffsetDateTime startDate = OffsetDateTime.now().withDayOfMonth(6).plusMonths(2L);
             projectService.updateRecurringEventsBasedOnStartDate(testProject, startDate);

             // THEN
             testProject.getEventTemplates().forEach(t -> assertThat(t.getProjectEvents()).hasSize(7));

         }

         @Test
         void should_update_events_newStartDate_in_the_past_oldStartDate_in_the_future() {
             // GIVEN
             ProjectEntity testProject2 = new ProjectEntity();
             OffsetDateTime today = OffsetDateTime.now().withDayOfMonth(6);
             createProject(testProject2, today.plusMonths(2L), today.plusMonths(8L));

             projectService.initializeProjectTasks(testProject2.getId());
             projectService.createRecurringEventTypes(testProject2);
             projectService.initializeRecurringEvents(testProject2);

             //WHEN
             OffsetDateTime startDate = OffsetDateTime.now().withDayOfMonth(6).minusMonths(2L);
             projectService.updateRecurringEventsBasedOnStartDate(testProject2, startDate);

             // THEN
             testProject2.getEventTemplates().forEach(t -> assertThat(t.getProjectEvents()).hasSize(8));

         }
     }

     private FormFieldEntity filterFormFieldKey (ResultEntity result, String key) {
         return result.getFormFields().stream().filter(r -> r.getKey().equals(key)).findFirst().get();
     }

     @Nested
     class SerieAppointments {
        ResultEntity result = null;

         @BeforeEach
         void setUp() {
             projectService.initializeProjectTasks(testProject.getId());

             for (ProjectTaskEntity projectTask: testProject.getProjectTaskTemplate().getProjectTasks()) {
                 if (projectTask.getResults().stream().anyMatch(r -> r.getResultType().equals("TYPE_APPT_SERIES"))) {
                     result = projectTask.getResults().stream().findFirst().get();
                 }
             }

             filterFormFieldKey(result, "participants").setValue("Müller");
             filterFormFieldKey(result, "startDate").setValue("2021-08-01");
             filterFormFieldKey(result, "endDate").setValue("2021-12-01");
             filterFormFieldKey(result, "startTime").setValue("14:05");
             filterFormFieldKey(result, "duration").setValue("2");
             filterFormFieldKey(result, "status").setValue("PLANNED");

         }

         @Test
         void should_create_appointments_for_result() {
             // WHEN
             projectService.createSerieAppointments(result);
             // THEN
             assertThat(result.getProjectEventTemplate()).isNotNull();
             assertThat(result.getProjectEventTemplate().getProjectEvents()).isNotNull().hasSize(4);

             result.getProjectEventTemplate().getProjectEvents().forEach(e -> assertThat(e)
                     .returns(filterFormFieldKey(result, "serie").getValue(), ProjectEventEntity::getTitle)
                     .returns(Integer.valueOf(filterFormFieldKey(result, "duration").getValue()), ProjectEventEntity::getDuration));

             result.getProjectEventTemplate().getProjectEvents().forEach(e -> {
                 assertThat(e.getDateTime()
                             .getDayOfMonth()).isEqualTo(10);
                 assertThat(e.getDateTime().getHour()).isEqualTo(14);
             });
         }

         @Test
         void should_update_appointments_for_result_after_updating_result() {
             // GIVEN
             projectService.createSerieAppointments(result);
             filterFormFieldKey(result, "appointment").setValue("FREQ=WEEKLY;BYDAY=MO;INTERVAL=1");
             filterFormFieldKey(result, "startTime").setValue("12:05");

             // WHEN
             projectService.updateSerieAppointments(result);

             // THEN
             assertThat(result.getProjectEventTemplate()).isNotNull();

             result.getProjectEventTemplate().getProjectEvents().forEach(e -> {
                 assertThat(e.getDateTime()
                             .getDayOfWeek()).isEqualTo(DayOfWeek.MONDAY);
                 assertThat(e.getDateTime().getHour()).isEqualTo(12);
             });
         }

     }


 }
