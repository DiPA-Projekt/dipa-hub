package online.dipa.hub.persistence.entities;

import java.util.Objects;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Basic(optional = false)
	@Column(name = "ID", nullable = false, unique = true, columnDefinition = "BIGINT")
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(final Long id) {
		this.id = id;
	}

	@Override
	public final int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public final boolean equals(final Object other) {
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
