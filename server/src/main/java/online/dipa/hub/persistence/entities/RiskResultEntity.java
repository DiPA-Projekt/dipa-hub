package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import online.dipa.hub.api.model.FormField;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import java.util.HashSet;
import java.util.Set;

import static javax.persistence.CascadeType.ALL;

@Entity
@Table(name = "risk_result")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RiskResultEntity extends BaseEntity {

    private String resultType;

    @OneToMany(mappedBy = "riskResult", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<FormFieldEntity> formFields = new HashSet<>();

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectTaskEntity projectTask;

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

}
