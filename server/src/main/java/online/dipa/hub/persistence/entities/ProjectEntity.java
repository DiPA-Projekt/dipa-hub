package online.dipa.hub.persistence.entities;

import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import online.dipa.hub.api.model.Project;

@Entity
@Table(name = "project")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String name;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private ProjectApproachEntity projectApproach;
    
    @OneToOne(mappedBy = "project")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private ProjectTaskTemplateEntity projectTaskTemplate;

    @OneToOne(mappedBy = "project")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private PlanTemplateEntity planTemplate;

    @OneToMany(mappedBy = "project")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<IncrementEntity> increments;

    @OneToOne(mappedBy = "project")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private ProjectRoleTemplateEntity projectRoleTemplate;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @NotFound(action = NotFoundAction.IGNORE)
    private UserEntity user;

    private String projectType;
    private String projectSize;
    private String akz;
    private String client;
    private String department;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;

    public ProjectEntity() {
        super();
    }

    public ProjectEntity(Project project) {
        this.name = project.getName();
        this.projectSize = project.getProjectSize().toString();
        this.projectType = project.getProjectType().toString();
        this.startDate = OffsetDateTime.of(project.getStart(),LocalTime.MIDNIGHT, ZoneOffset.UTC);
        this.endDate = OffsetDateTime.of(project.getEnd(), LocalTime.MIDNIGHT, ZoneOffset.UTC);
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public ProjectApproachEntity getProjectApproach() {
        return projectApproach;
    }

    public void setProjectApproach(final ProjectApproachEntity projectApproach) {
        this.projectApproach = projectApproach;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(final String projectType) {
        this.projectType = projectType;
    }

    public void setAkz(final String akz) {
        this.akz = akz;
    }

    public String getAkz() {
        return akz;
    }

    public ProjectTaskTemplateEntity getProjectTaskTemplate() {
        return projectTaskTemplate;
    }

    public void setProjectTaskTemplate(final ProjectTaskTemplateEntity projectTaskTemplate) {
        this.projectTaskTemplate = projectTaskTemplate;
    }

    public PlanTemplateEntity getPlanTemplate() {
        return planTemplate;
    }

    public void setPlanTemplate(final PlanTemplateEntity planTemplate) {
        this.planTemplate = planTemplate;

    }

    public Set<IncrementEntity> getIncrements() {
        return increments;
    }

    public void setIncrements(final Set<IncrementEntity> increments) {
        this.increments = increments;
    }

    public String getProjectSize() {
        return projectSize;
    }

    public void setProjectSize(final String projectSize) {
        this.projectSize = projectSize;
    }
    
    public String getClient() {
        return client;
    }

    public void setClient(final String client) {
        this.client = client;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(final String department) {
        this.department = department;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(final UserEntity user) {
        this.user = user;
    }

    public OffsetDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(final OffsetDateTime startDate) {
        this.startDate = startDate;
    }
    
    public OffsetDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(final OffsetDateTime endDate) {
        this.endDate = endDate;
    }

    public ProjectRoleTemplateEntity getProjectRoleTemplate() {
        return projectRoleTemplate;
    }

    public void setProjectRoleTemplate(final ProjectRoleTemplateEntity projectRoleTemplate) {
        this.projectRoleTemplate = projectRoleTemplate;
    }

}
