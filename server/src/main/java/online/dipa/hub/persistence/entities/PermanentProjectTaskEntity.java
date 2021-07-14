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
@Table(name = "permanent_project_task")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PermanentProjectTaskEntity extends BaseEntity {

    private String title;
    private String icon;
    private Long sortOrder;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private PermanentProjectTaskTemplateEntity permanentProjectTaskTemplate;

    @NotNull
    @OneToOne(fetch = FetchType.EAGER)
    private ProjectTaskEntity projectTask;

    public PermanentProjectTaskEntity() {
        super();
    }

    public PermanentProjectTaskEntity(final String title, final String icon, final Long sortOrder) {
        this.title = title;
        this.icon = icon;
        this.sortOrder = sortOrder;
    }

    public PermanentProjectTaskEntity(PermanentProjectTaskEntity projectTaskEntity) {
        this.title = projectTaskEntity.getTitle();
        this.icon = projectTaskEntity.getIcon();
        this.sortOrder = projectTaskEntity.getSortOrder();
    }
    
    public PermanentProjectTaskTemplateEntity getPermanentProjectTaskTemplate() {
        return permanentProjectTaskTemplate;
    }

    public void setPermanentProjectTaskTemplate(final PermanentProjectTaskTemplateEntity permanentProjectTaskTemplate) {
        this.permanentProjectTaskTemplate = permanentProjectTaskTemplate;
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
