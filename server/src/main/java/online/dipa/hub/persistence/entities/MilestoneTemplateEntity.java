package online.dipa.hub.persistence.entities;

import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import javax.persistence.Basic;
import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import online.dipa.hub.api.model.Milestone;

@Entity
@Table(name = "milestone_template")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class MilestoneTemplateEntity extends BaseEntity {

    @Size(max = 255)
    @NotEmpty
    @Basic(optional = false)
    private String name;

    @Basic(optional = false)
    private int dateOffset;

    @Basic(optional = true)
    private OffsetDateTime date;

    @Basic(optional = true)
    private boolean isMaster;

    @NotEmpty
    @Basic(optional = false)
    private String status;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @NotFound(action = NotFoundAction.IGNORE)
    private PlanTemplateEntity planTemplate;

    public MilestoneTemplateEntity() {
        super();
    }

    public MilestoneTemplateEntity(MilestoneTemplateEntity milestone) {
        this.name = milestone.getName();
        this.dateOffset = milestone.getDateOffset();
        this.date = milestone.getDate();
        this.status = milestone.getStatus();
        this.isMaster = milestone.getIsMaster();
    }

    public MilestoneTemplateEntity(Milestone milestone) {
        this.name = milestone.getName();
        this.date =  OffsetDateTime.of(milestone.getDate(), LocalTime.NOON, ZoneOffset.UTC);
        this.status = milestone.getStatus().toString();
        this.isMaster = false;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public int getDateOffset() {
        return dateOffset;
    }

    public void setDateOffset(final int dateOffset) {
        this.dateOffset = dateOffset;
    }
    
    public OffsetDateTime getDate() {
        return date;
    }

    public void setDate(final OffsetDateTime date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }
    
    public boolean getIsMaster() {
        return isMaster;
    }

    public void setIsMaster(final boolean isMaster) {
        this.isMaster = isMaster;
    }

    public PlanTemplateEntity getPlanTemplate() {
        return planTemplate;
    }

    public void setPlanTemplate(final PlanTemplateEntity planTemplate) {
        this.planTemplate = planTemplate;
    }
}
