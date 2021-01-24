package online.dipa.hub.persistence.repositories;

import online.dipa.hub.persistence.entities.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
}
