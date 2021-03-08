package online.dipa.hub.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import online.dipa.hub.persistence.entities.SingleAppointmentResultEntity;

public interface SingleAppointmentResultRepository extends JpaRepository<SingleAppointmentResultEntity, Long> {
}
