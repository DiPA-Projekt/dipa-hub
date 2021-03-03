// package online.dipa.hub.persistence.entities;

// import static javax.persistence.CascadeType.ALL;

// import java.util.HashSet;
// import java.util.Set;

// import javax.persistence.Basic;
// import javax.persistence.Cacheable;
// import javax.persistence.Column;
// import javax.persistence.Entity;
// import javax.persistence.ManyToMany;
// import javax.persistence.OneToMany;
// import javax.persistence.Table;
// import javax.validation.constraints.NotNull;
// import javax.validation.constraints.Size;

// import org.hibernate.annotations.Cache;
// import org.hibernate.annotations.CacheConcurrencyStrategy;

// @Entity
// @Table(name = "project_size")
// @Cacheable
// @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
// public class ProjectSizeEntity extends BaseEntity {

//     @Size(max = 255)
//     @NotNull
//     @Basic(optional = false)
//     @Column(unique = true)
//     private String name;

//     @ManyToMany(mappedBy = "projectSize", cascade = { ALL })
//     @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
//     private Set<ProjectTaskTemplateEntity> projectTaskTemplates = new HashSet<>();

//     @OneToMany(mappedBy = "projectSize", cascade = { ALL })
//     @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
//     private Set<ProjectEntity> project = new HashSet<>();

//     public String getName() {
//         return name;
//     }

//     public void setName(final String name) {
//         this.name = name;
//     }

//     public Set<ProjectTaskTemplateEntity> getProjectTaskTemplates() {
//         return projectTaskTemplates;
//     }

//     public void setProjectTaskTemplates(final Set<ProjectTaskTemplateEntity> projectTaskTemplates) {
//         this.projectTaskTemplates = projectTaskTemplates;
//     }

//     public Set<ProjectEntity> getProject() {
//         return project;
//     }

//     public void setProject(final Set<ProjectEntity> project) {
//         this.project = project;
//     }
// }
