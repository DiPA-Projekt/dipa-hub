package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "project_task")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectTaskEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    private String title;

    private boolean optional;
    private String explanation;
    private boolean completed;
    private Long sortOrder;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectTaskTemplateEntity projectTaskTemplate;

    @OneToMany(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<FormFieldEntity> entries = new HashSet<>();

    @OneToMany(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ResultEntity> results = new HashSet<>();

    public ProjectTaskEntity() {
        super();
    }

    public ProjectTaskEntity(ProjectTaskEntity projectTaskEntity) {
        this.title = projectTaskEntity.getTitle();
        this.optional = projectTaskEntity.getOptional();
        this.explanation = projectTaskEntity.getExplanation();
        this.completed = projectTaskEntity.getCompleted();
        this.sortOrder = projectTaskEntity.getSortOrder();
    }
    
    public ProjectTaskTemplateEntity getProjectTaskTemplate() {
        return projectTaskTemplate;
    }

    public void setProjectTaskTemplate(final ProjectTaskTemplateEntity projectTaskTemplate) {
        this.projectTaskTemplate = projectTaskTemplate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public boolean getOptional() {
        return optional;
    }

    public void setOptional(final boolean optional) {
        this.optional = optional;
    }

    public String getExplanation() {
        return explanation;
    }
    
    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public boolean getCompleted() {
        return completed;
    }

    public void setCompleted(final boolean completed) {
        this.completed = completed;
    }

    public Set<FormFieldEntity> getEntries() {
        return entries;
    }

    public void setEntries(final Set<FormFieldEntity> entries) {
        this.entries = entries;
    }

    public Set<ResultEntity> getResults() {
        return results;
    }

    public void setResults(final Set<ResultEntity> results) {
        this.results = results;
    }
    
    public Long getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Long sortOrder) {
        this.sortOrder = sortOrder;
    }

}
