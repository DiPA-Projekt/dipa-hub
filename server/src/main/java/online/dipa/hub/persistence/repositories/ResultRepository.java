package online.dipa.hub.persistence.repositories;

import online.dipa.hub.persistence.entities.ResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<ResultEntity, Long> {
}
