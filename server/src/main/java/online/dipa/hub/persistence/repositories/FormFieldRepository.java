package online.dipa.hub.persistence.repositories;

import online.dipa.hub.persistence.entities.FormFieldEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormFieldRepository extends JpaRepository<FormFieldEntity, Long> {
}
