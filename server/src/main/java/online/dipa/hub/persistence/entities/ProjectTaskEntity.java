package online.dipa.hub.persistence.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import static javax.persistence.CascadeType.ALL;
import java.util.HashSet;
import java.util.Set;

import online.dipa.hub.api.model.FormField;
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

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectTaskTemplateEntity projectTaskTemplate;

    @OneToMany(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<FormFieldEntity> entries = new HashSet<>();

    @OneToMany(mappedBy = "projectTask", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<StandardResultEntity> standardResults = new HashSet<>();

    @OneToMany(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ContactPersonResultEntity> contactPersonResults = new HashSet<>();
    
    @OneToMany(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ELBEShoppingCartResultEntity> elbeShoppingCartResults = new HashSet<>();

    @OneToMany(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<AppointmentSeriesResultEntity> appointmentSeriesResults = new HashSet<>();
    
    @OneToMany(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<RiskResultEntity> riskResults = new HashSet<>();

    @OneToMany(mappedBy = "projectTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<SingleAppointmentResultEntity> singleAppointmentResults = new HashSet<>();
    
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

    public Set<FormFieldEntity> getFormFields() {
        return entries;
    }

    public void setFormFields(final Set<FormFieldEntity> entries) {
        this.entries = entries;
    }

    public Set<StandardResultEntity> getStandardResult() {
        return standardResults;
    }

    public void setStandardResult(final Set<StandardResultEntity> standardResults) {
        this.standardResults = standardResults;
    }

    public Set<ContactPersonResultEntity> getContactPersonResult() {
        return contactPersonResults;
    }

    public void setContactPersonResult(final Set<ContactPersonResultEntity> contactPersonResults) {
        this.contactPersonResults = contactPersonResults;
    }
    
    public Set<ELBEShoppingCartResultEntity> getELBEShoppingCartResults() {
        return elbeShoppingCartResults;
    }

    public void setELBEShoppingCartResults(final Set<ELBEShoppingCartResultEntity> elbeShoppingCartResults) {
        this.elbeShoppingCartResults = elbeShoppingCartResults;
    }

    public Set<AppointmentSeriesResultEntity> getAppointmentSeriesResults() {
        return appointmentSeriesResults;
    }

    public void setAppointmentSeriesResults(final Set<AppointmentSeriesResultEntity> appointmentSeriesResults) {
        this.appointmentSeriesResults = appointmentSeriesResults;
    }

    public Set<RiskResultEntity> getRiskResults() {
        return riskResults;
    }

    public void setRiskResults(final Set<RiskResultEntity> riskResults) {
        this.riskResults = riskResults;
    }

    public Set<SingleAppointmentResultEntity> getSingleAppointmentResults() {
        return singleAppointmentResults;
    }

    public void setSingleAppointmentResults(final Set<SingleAppointmentResultEntity> singleAppointmentResults) {
        this.singleAppointmentResults = singleAppointmentResults;
    }

}
