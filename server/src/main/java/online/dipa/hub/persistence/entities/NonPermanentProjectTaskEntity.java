package online.dipa.hub.persistence.entities;

import javax.persistence.Basic;
import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "non_permanent_project_task")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class NonPermanentProjectTaskEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    private String title;

    private String icon;
    private Long sortOrder;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private NonPermanentProjectTaskTemplateEntity nonPermanentProjectTaskTemplate;

    @NotNull
    @OneToOne(fetch = FetchType.EAGER)
    private ProjectTaskEntity projectTask;

    public NonPermanentProjectTaskEntity() {
        super();
    }

    public NonPermanentProjectTaskEntity(NonPermanentProjectTaskEntity projectTaskEntity) {
        this.title = projectTaskEntity.getTitle();
        this.icon = projectTaskEntity.getIcon();
        this.sortOrder = projectTaskEntity.getSortOrder();
    }

    public NonPermanentProjectTaskTemplateEntity getNonPermanentProjectTaskTemplate() {
        return nonPermanentProjectTaskTemplate;
    }

    public void setNonPermanentProjectTaskTemplate(final NonPermanentProjectTaskTemplateEntity nonPermanentProjectTaskTemplate) {
        this.nonPermanentProjectTaskTemplate = nonPermanentProjectTaskTemplate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(final String icon) {
        this.icon = icon;
    }

    public ProjectTaskEntity getProjectTask() {
        return projectTask;
    }

    public void setProjectTask(final ProjectTaskEntity projectTask) {
        this.projectTask = projectTask;
    }

    public Long getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Long sortOrder) {
        this.sortOrder = sortOrder;
    }

}
