package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "project_task")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectTaskEntity extends BaseEntity {

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

    @OneToOne(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private PermanentProjectTaskEntity permanentProjectTask;

    @OneToOne(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private NonPermanentProjectTaskEntity nonPermanentProjectTask;

    @OneToOne(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private FinalProjectTaskEntity finalProjectTask;

    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectPropertyQuestionEntity projectPropertyQuestion;

    public ProjectTaskEntity() {
        super();
    }

    public ProjectTaskEntity(String explanation, boolean completed, Long sortOrder) {
        this.explanation = explanation;
        this.completed = completed;
        this.sortOrder = sortOrder;
    }

    public ProjectTaskEntity(ProjectTaskEntity projectTaskEntity) {
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

    public PermanentProjectTaskEntity getPermanentProjectTask() {
        return permanentProjectTask;
    }

    public void setPermanentProjectTask(PermanentProjectTaskEntity permanentProjectTask) {
        this.permanentProjectTask = permanentProjectTask;
    }

    public NonPermanentProjectTaskEntity getNonPermanentProjectTask() {
        return nonPermanentProjectTask;
    }

    public void setNonPermanentProjectTask(NonPermanentProjectTaskEntity nonPermanentProjectTask) {
        this.nonPermanentProjectTask = nonPermanentProjectTask;

    }

    public FinalProjectTaskEntity getFinalProjectTask() {
        return finalProjectTask;
    }

    public void setFinalProjectTask(FinalProjectTaskEntity finalProjectTask) {
        this.finalProjectTask = finalProjectTask;
    }

    public ProjectPropertyQuestionEntity getProjectPropertyQuestion() {
        return projectPropertyQuestion;
    }

    public void setProjectPropertyQuestion(final ProjectPropertyQuestionEntity projectPropertyQuestion) {
        this.projectPropertyQuestion = projectPropertyQuestion;
    }

}
