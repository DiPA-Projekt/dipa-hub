package online.dipa.hub.persistence.repositories;

import static org.assertj.core.api.Assertions.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import online.dipa.hub.persistence.entities.ProjectEntity;
import online.dipa.hub.tenancy.CurrentTenantContextHolder;

@SpringBootTest
@Transactional
class ProjectRepositoryTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectApproachRepository projectApproachRepository;

    List<Long> projectsId = new ArrayList<>();

    @BeforeAll
    static void setUpContext() {
        CurrentTenantContextHolder.setTenantId("weit");
    }

    private void saveProject(final String name, final boolean archived, final String description) {
        final ProjectEntity project = new ProjectEntity(name, "SMALL", "internes Projekt", OffsetDateTime.now(),
                OffsetDateTime.now()
                              .plusDays(30), archived, description);
        projectApproachRepository.findById(2L)
                                 .ifPresent(project::setProjectApproach);
        projectRepository.save(project);
        projectsId.add(project.getId());
    }

    @BeforeEach
    public void setUp() {
        projectRepository.deleteAll();

        saveProject("testProject1", false, "Beschreibung 1");
        saveProject("testProject2", true, "Beschreibung 2");
        saveProject("testProject3", true, "Beschreibung 3");
    }

    @Nested
    class FindByArchived {

        @Test
        void should_return_archived_projects() {
            // GIVEN
            final boolean archived = true;
            final List<ProjectEntity> projects = new ArrayList<>();
            projectRepository.findById(projectsId.get(1))
                             .ifPresent(projects::add);
            projectRepository.findById(projectsId.get(2))
                             .ifPresent(projects::add);

            // WHEN
            final Collection<ProjectEntity> archivedProjects = projectRepository.findByArchived(archived);

            // THEN
            assertThat(archivedProjects).hasSize(2)
                                        .containsAll(projects);
        }

        @Test
        void should_return_not_archived_projects() {
            // GIVEN
            final boolean archived = false;

            // WHEN
            final Collection<ProjectEntity> archivedProjects = projectRepository.findByArchived(archived);

            // THEN
            assertThat(archivedProjects).hasSize(1)
                                        .contains(projectRepository.findById(projectsId.get(0))
                                                                   .get());
        }

    }

}