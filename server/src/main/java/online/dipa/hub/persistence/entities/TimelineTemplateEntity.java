package online.dipa.hub.persistence.entities;

import javax.persistence.Basic;
import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "timeline_template")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TimelineTemplateEntity extends BaseEntity {

	@Size(max = 255)
	@Basic(optional = false)
	@Column(length = 255, unique = true, nullable = false)
	private String name;

	@Basic(optional = false)
	private boolean defaultTemplate;

	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public boolean isDefaultTemplate() {
		return defaultTemplate;
	}

	public void setDefaultTemplate(final boolean defaultTemplate) {
		this.defaultTemplate = defaultTemplate;
	}
}
