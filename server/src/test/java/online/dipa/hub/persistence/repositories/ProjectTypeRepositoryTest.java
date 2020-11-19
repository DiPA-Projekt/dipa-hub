package online.dipa.hub.persistence.repositories;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import online.dipa.hub.persistence.entities.ProjectTypeEntity;

import java.time.LocalDate;

@SpringBootTest
class ProjectTypeRepositoryTest {

    @Autowired
    private ProjectTypeRepository projectTypeRepository;

    @Test
    void allDataInitializedCorrectly() {
        assertThat(projectTypeRepository.findAll()).hasSize(3)
                                                   .extracting(ProjectTypeEntity::getId, ProjectTypeEntity::getName,
                                                           ProjectTypeEntity::getStart, ProjectTypeEntity::getEnd,
                                                           ProjectTypeEntity::isDefaultType)
                                                   .containsExactly(tuple(1L, "Serveraustausch", LocalDate.parse("2020-08-19"), LocalDate.parse("2023-03-21"), false),
                                                           tuple(2L, "Softwareneuentwicklung", LocalDate.parse("2020-08-19"), LocalDate.parse("2022-08-23"), false),
                                                           tuple(3L, "Beschaffung", LocalDate.parse("2020-08-17"), LocalDate.parse("2024-08-19"), true));
    }

}