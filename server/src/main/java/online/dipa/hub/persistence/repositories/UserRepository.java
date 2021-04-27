package online.dipa.hub.persistence.repositories;

import online.dipa.hub.persistence.entities.UserEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
}
