package online.dipa.hub.persistence.entities;

import javax.persistence.Basic;
import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "project_property_question")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectPropertyQuestionEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    private String question;

    private String description;
    private boolean selected;
    private int sortOrder;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectEntity project;

    public ProjectPropertyQuestionEntity() {
        super();
    }

    public ProjectPropertyQuestionEntity(ProjectPropertyQuestionEntity projectPropertyQuestionEntity) {
        this.question = projectPropertyQuestionEntity.getQuestion();
        this.description = projectPropertyQuestionEntity.getDescription();
        this.selected = projectPropertyQuestionEntity.getSelected();
        this.sortOrder = projectPropertyQuestionEntity.getSortOrder();
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(final String question) {
        this.question = question;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public boolean getSelected() {
        return selected;
    }

    public void setSelected(final boolean selected) {
        this.selected = selected;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(final int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(final ProjectEntity project) {
        this.project = project;
    }
}
