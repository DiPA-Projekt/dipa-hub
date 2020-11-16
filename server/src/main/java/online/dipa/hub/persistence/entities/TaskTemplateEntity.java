package online.dipa.hub.persistence.entities;

import javax.persistence.Basic;
import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "task_template")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TaskTemplateEntity extends BaseEntity {

    @Size(max = 255)
    @Basic(optional = false)
    @NotEmpty
    @Column(length = 255)
    private String name;

    @Basic
    @Column(nullable = false)
    private int startOffset;

    @Basic
    @Column(nullable = false)
    private int endOffset;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private ProjectTypeEntity projectType;

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public int getStartOffset() {
        return startOffset;
    }

    public void setStartOffset(final int startOffset) {
        this.startOffset = startOffset;
    }

    public int getEndOffset() {
        return endOffset;
    }

    public void setEndOffset(final int endOffset) {
        this.endOffset = endOffset;
    }

    public ProjectTypeEntity getProjectType() {
        return projectType;
    }

    public void setProjectType(final ProjectTypeEntity projectType) {
        this.projectType = projectType;
    }
}
