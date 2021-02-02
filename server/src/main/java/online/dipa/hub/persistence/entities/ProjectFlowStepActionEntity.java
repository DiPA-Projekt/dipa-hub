package online.dipa.hub.persistence.entities;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name = "project_flow_step_action")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectFlowStepActionEntity extends BaseEntity {

    @Basic
    private String explanation;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private ProjectFlowStepEntity projectFlowStep;

    @NotNull
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "project_flow_step_action_link",
            joinColumns = { @JoinColumn(name = "project_flow_step_action_id") },
            inverseJoinColumns = { @JoinColumn(name = "external_link_id") }
    )
    private List<ExternalLinkEntity> actionLinks;


    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public List<ExternalLinkEntity> getExternalLinks() {
        return actionLinks;
    }

    public void setExternalLinks(final List<ExternalLinkEntity> actionLinks) {
        this.actionLinks = actionLinks;
    }

}