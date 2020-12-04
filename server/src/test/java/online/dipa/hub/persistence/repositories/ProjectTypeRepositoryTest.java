// package online.dipa.hub.persistence.repositories;

// import static org.assertj.core.api.Assertions.*;

// import org.junit.jupiter.api.AfterEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;

// import online.dipa.hub.persistence.entities.ProjectTypeEntity;
// import online.dipa.hub.tenancy.CurrentTenantContextHolder;

// @SpringBootTest
// class ProjectTypeRepositoryTest {

//     @Autowired
//     private ProjectTypeRepository projectTypeRepository;

//     @Test
//     void allBaDataInitializedCorrectly() {
//         CurrentTenantContextHolder.setTenantId("ba");
//         assertThat(projectTypeRepository.findAll()).hasSize(2)
//                                                    .extracting(ProjectTypeEntity::getId, ProjectTypeEntity::getName,
//                                                            ProjectTypeEntity::isDefaultType)
//                                                    .containsExactly(tuple(1L, "Serveraustausch", true),
//                                                            tuple(3L, "Beschaffung", false));
//     }

//     @Test
//     void allItzbundDataInitializedCorrectly() {
//         CurrentTenantContextHolder.setTenantId("itzbund");
//         assertThat(projectTypeRepository.findAll()).hasSize(2)
//                                                    .extracting(ProjectTypeEntity::getId, ProjectTypeEntity::getName,
//                                                            ProjectTypeEntity::isDefaultType)
//                                                    .containsExactly(tuple(2L, "Softwareneuentwicklung", true),
//                                                            tuple(3L, "Beschaffung", false));
//     }

//     @AfterEach
//     void deleteTentantId() {
//         CurrentTenantContextHolder.clearTenantId();
//     }

// }