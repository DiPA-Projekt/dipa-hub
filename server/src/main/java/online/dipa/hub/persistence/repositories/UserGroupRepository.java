package online.dipa.hub.persistence.repositories;

import online.dipa.hub.persistence.entities.UserGroupEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserGroupRepository extends JpaRepository<UserGroupEntity, Long> {
}
