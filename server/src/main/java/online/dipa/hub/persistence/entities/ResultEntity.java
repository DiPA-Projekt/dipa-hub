package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import java.util.HashSet;
import java.util.Set;

import static javax.persistence.CascadeType.ALL;

@Entity
@Table(name = "project_task_result")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResultEntity extends BaseEntity {

    private String resultType;

    @OneToMany(mappedBy = "result", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<FormFieldEntity> formFields = new HashSet<>();

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectTaskEntity projectTask;

    @OneToOne(mappedBy = "result")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private RecurringEventPatternEntity recurringEventPattern;

    @OneToOne(mappedBy = "result", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private ProjectEventTemplateEntity projectEventTemplate;

    public String getResultType() {
        return resultType;
    }

    public void setResultType(final String resultType) {
        this.resultType = resultType;
    }

    public ProjectTaskEntity getProjectTask() {
        return projectTask;
    }

    public void setProjectTask(final ProjectTaskEntity projectTask) {
        this.projectTask = projectTask;
    }

    public Set<FormFieldEntity> getFormFields() {
        return formFields;
    }

    public void setFormFields(Set<FormFieldEntity> formFields) {
        this.formFields = formFields;
    }

    public RecurringEventPatternEntity getRecurringEventPattern() {
        return recurringEventPattern;
    }

    public void setRecurringEventPattern(final RecurringEventPatternEntity recurringEventPattern) {
        this.recurringEventPattern = recurringEventPattern;
    }

    public ProjectEventTemplateEntity getProjectEventTemplate() {
        return projectEventTemplate;
    }

    public void setProjectEventTemplate(final ProjectEventTemplateEntity projectEventTemplate) {
        this.projectEventTemplate = projectEventTemplate;
    }
}
