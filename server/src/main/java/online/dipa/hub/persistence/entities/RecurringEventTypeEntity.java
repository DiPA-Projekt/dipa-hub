package online.dipa.hub.persistence.entities;

import static javax.persistence.CascadeType.ALL;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "recurring_event_type")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RecurringEventTypeEntity extends BaseEntity {

    private String title;
    private String description;
    private boolean mandatory;
    private boolean master;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectEntity project;

    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectPropertyQuestionEntity projectPropertyQuestion;

    @OneToOne(mappedBy = "recurringEventType")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private RecurringEventPatternEntity recurringEventPattern;

    @OneToMany(mappedBy = "recurringEventType", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ProjectEventTemplateEntity> eventTemplates = new HashSet<>();

    public RecurringEventTypeEntity() {
        super();
    }

    public RecurringEventTypeEntity(final RecurringEventTypeEntity entity) {
        this.title = entity.getTitle();
        this.description = entity.getDescription();
        this.mandatory = entity.isMandatory();
        this.master = false;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public boolean isMandatory() {
        return mandatory;
    }

    public void setMandatory(final boolean mandatory) {
        this.mandatory = mandatory;
    }

    public boolean isMaster() {
        return master;
    }

    public void setMaster(final boolean master) {
        this.master = master;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(final ProjectEntity project) {
        this.project = project;
    }

    public ProjectPropertyQuestionEntity getProjectPropertyQuestion() {
        return projectPropertyQuestion;
    }

    public void setProjectPropertyQuestion(final ProjectPropertyQuestionEntity projectPropertyQuestion) {
        this.projectPropertyQuestion = projectPropertyQuestion;
    }


    public RecurringEventPatternEntity getRecurringEventPattern() {
        return recurringEventPattern;
    }

    public void setRecurringEventPattern(final RecurringEventPatternEntity recurringEventPattern) {
        this.recurringEventPattern = recurringEventPattern;
    }

    public Set<ProjectEventTemplateEntity> getEventTemplates() {
        return eventTemplates;
    }

    public void setEventTemplates(Set<ProjectEventTemplateEntity> eventTemplates) {
        this.eventTemplates = eventTemplates;
    }

}
