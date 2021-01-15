package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.OperationTypeEntity;

public interface OperationTypeRepository extends JpaRepository<OperationTypeEntity, Long> {
}
