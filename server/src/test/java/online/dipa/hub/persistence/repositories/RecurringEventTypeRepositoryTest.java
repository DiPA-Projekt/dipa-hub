package online.dipa.hub.persistence.repositories;

import static org.assertj.core.api.Assertions.*;

import java.util.Collection;
import javax.transaction.Transactional;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import online.dipa.hub.persistence.entities.RecurringEventTypeEntity;

@SpringBootTest
@Transactional
public class RecurringEventTypeRepositoryTest {


    @Autowired
    private RecurringEventTypeRepository recurringEventTypeRepository;

    @Nested
    class FindByMaster {

        @Test
        void should_return_master_event_types() {
            // GIVEN

            // WHEN
            final Collection<RecurringEventTypeEntity> masterEventTypes = recurringEventTypeRepository.findByMaster();

            // THEN
            assertThat(masterEventTypes)
                    .hasSize(4);
        }

    }
}
