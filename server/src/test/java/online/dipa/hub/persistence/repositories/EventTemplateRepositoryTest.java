package online.dipa.hub.persistence.repositories;

import static org.assertj.core.api.Assertions.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.persistence.entities.ProjectEventTemplateEntity;
import online.dipa.hub.persistence.entities.RecurringEventTypeEntity;
import online.dipa.hub.services.ProjectService;
import online.dipa.hub.tenancy.CurrentTenantContextHolder;

@SpringBootTest
@Transactional
public class EventTemplateRepositoryTest {

    @Autowired
    private EventTemplateRepository eventTemplateRepository;

    @Autowired
    private ProjectApproachRepository projectApproachRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectService projectService;

    ProjectEntity testProject;

    @BeforeAll
    static void setUpContext() {
        CurrentTenantContextHolder.setTenantId("weit");
    }

    @BeforeEach
    void setUp() {
        final OffsetDateTime today = OffsetDateTime.now()
                                                   .withDayOfMonth(6);
        testProject = new ProjectEntity();
        testProject.setName("Test Project");
        testProject.setProjectApproach(projectApproachRepository.getById(2L));
        testProject.setProjectSize("SMALL");
        testProject.setStartDate(today.minusMonths(5L));
        testProject.setEndDate(today.plusMonths(4L));
        projectRepository.save(testProject);

        projectService.initializeProjectTasks(testProject.getId());
        projectService.createRecurringEventTypes(testProject);
        projectService.initializeRecurringEvents(testProject);

    }

    @Nested
    class FindByRecurringEventType {

        @Test
        void should_return_event_templates_by_recurring_event_type() {
            // GIVEN
            final RecurringEventTypeEntity recurringEventType = testProject.getRecurringEventTypes()
                                                                           .stream()
                                                                           .findFirst()
                                                                           .get();

            // WHEN
            final Collection<ProjectEventTemplateEntity> eventTemplates = eventTemplateRepository.findByRecurringEventType(
                    recurringEventType);

            // THEN
            assertThat(eventTemplates).isNotEmpty()
                                      .hasSize(1);
            assertThat(new ArrayList<>(eventTemplates).get(0)).returns("TYPE_RECURRING_EVENT",
                    ProjectEventTemplateEntity::getEventType);
        }

    }
}
