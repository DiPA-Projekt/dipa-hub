package online.dipa.hub.persistence.repositories;

import static org.assertj.core.api.BDDAssertions.then;

import java.util.Optional;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import online.dipa.hub.persistence.entities.UserEntity;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Nested
    class FindByKeycloakId {

        @Test
        void should_return_when_user_exists() {
            // GIVEN
            final String keycloakId = "f5cde284-a3c2-40b8-9aa6-631fa016e6ba";

            // WHEN
            final Optional<UserEntity> byKeycloakId = userRepository.findByKeycloakId(keycloakId);

            // THEN
            then(byKeycloakId).isNotEmpty()
                              .get()
                              .returns(3L, UserEntity::getId);
        }

        @Test
        void should_return_empty_when_user_does_not_exist() {
            // GIVEN
            final String keycloakId = "f5cde284-xxxx-40b8-9aa6-631fa016e6ba";

            // WHEN
            final Optional<UserEntity> byKeycloakId = userRepository.findByKeycloakId(keycloakId);

            // THEN
            then(byKeycloakId).isEmpty();
        }
    }

}