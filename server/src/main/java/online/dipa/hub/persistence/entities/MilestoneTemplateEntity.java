package online.dipa.hub.persistence.entities;

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

    @NotEmpty
    @Basic(optional = false)
    private String status;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private PlanTemplateEntity planTemplate;

    public MilestoneTemplateEntity() {
        super();
    }

    public MilestoneTemplateEntity(MilestoneTemplateEntity milestone) {
        this.name = milestone.getName();
        this.dateOffset = milestone.getDateOffset();
        this.status = milestone.getStatus();
        // this.planTemplate = planTemplate;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public PlanTemplateEntity getPlanTemplate() {
        return planTemplate;
    }

    public void setPlanTemplate(final PlanTemplateEntity planTemplate) {
        this.planTemplate = planTemplate;
    }
}
