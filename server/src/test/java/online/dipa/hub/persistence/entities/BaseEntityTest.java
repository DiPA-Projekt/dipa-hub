package online.dipa.hub.persistence.entities;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;

public class BaseEntityTest {

	@Test
	void noEqualityForNewlyConstructedEntities() {
		final DummyEntity dummyA = new DummyEntity();
		final DummyEntity dummyB = new DummyEntity();

		assertThat(dummyA).as("check newly created entity")
						  .isNotEqualTo(dummyB);
	}

	@Test
	void equalityForEntitiesWithSameId() {
		final DummyEntity dummyA = new DummyEntity();
		dummyA.setId(1L);
		final DummyEntity dummyB = new DummyEntity();
		dummyB.setId(1L);

		assertThat(dummyA).hasSameHashCodeAs(dummyB)
						  .isEqualTo(dummyB);
	}

	@Test
	void nonEqualityForEntitiesWithSameIdOfDifferentClass() {
		final DummyEntity dummy = new DummyEntity();
		dummy.setId(1L);
		final AnotherDummyEntity anotherDummy = new AnotherDummyEntity();
		anotherDummy.setId(1L);

		assertThat(dummy).isNotEqualTo(anotherDummy);
	}

	public static class DummyEntity extends BaseEntity {

	}

	public static class AnotherDummyEntity extends BaseEntity {

	}

}
