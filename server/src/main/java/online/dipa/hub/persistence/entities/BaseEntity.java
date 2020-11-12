package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import java.util.Objects;

@MappedSuperclass
public abstract class BaseEntity {

    private Long id;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "ID", nullable = false, unique = true, columnDefinition = "BIGINT")
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public final int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public final boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (other == null) {
            return false;
        }
        if (getClass() != other.getClass()) {
            return false;
        }
        final BaseEntity otherAbstractEntity = (BaseEntity) other;

        if (id == null && otherAbstractEntity.id == null) {
            return super.equals(otherAbstractEntity);
        }

        return Objects.equals(id, otherAbstractEntity.id);
    }
}
