package online.dipa.hub.persistence.repositories;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import online.dipa.hub.persistence.entities.ProjectTypeEntity;

@SpringBootTest
class ProjectTypeRepositoryTest {

    @Autowired
    private ProjectTypeRepository projectTypeRepository;

    @Test
    void allDataInitializedCorrectly() {
        assertThat(projectTypeRepository.findAll()).hasSize(3)
                                                   .extracting(ProjectTypeEntity::getId, ProjectTypeEntity::getName,
                                                           ProjectTypeEntity::isDefaultType)
                                                   .containsExactly(tuple(1L, "Serveraustausch", false),
                                                           tuple(2L, "Softwareneuentwicklung", false),
                                                           tuple(3L, "Beschaffung", true));
    }

}