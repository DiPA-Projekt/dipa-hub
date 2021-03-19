package online.dipa.hub.persistence.entities;

import online.dipa.hub.api.model.OptionEntry;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import java.util.HashSet;
import java.util.Set;

import static javax.persistence.CascadeType.ALL;
import static online.dipa.hub.api.model.FormField.TypeEnum;
import static online.dipa.hub.api.model.FormField.ControlTypeEnum;

@Entity
@Table(name = "project_task_form_field")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FormFieldEntity extends BaseEntity {

    private String value;

    private String key;

    private String label;

    private String placeholder;

    private boolean required;

    private Long sortOrder;

    private String controlType;

    private String type;

    private boolean show;

    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectTaskEntity projectTask;

    @OneToMany(mappedBy = "formField", cascade = { ALL })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<OptionEntryEntity> options = new HashSet<>();

    @ManyToOne(fetch = FetchType.EAGER)
    private AppointmentSeriesResultEntity appointmentSeriesResult;

    @ManyToOne(fetch = FetchType.EAGER)
    private ContactPersonResultEntity contactPersonResult;

    @ManyToOne(fetch = FetchType.EAGER)
    private ELBEShoppingCartResultEntity elbeShoppingCartResult;

    @ManyToOne(fetch = FetchType.EAGER)
    private RiskResultEntity riskResult;

    @ManyToOne(fetch = FetchType.EAGER)
    private SingleAppointmentResultEntity singleAppointmentResult;

    @ManyToOne(fetch = FetchType.EAGER)
    private StandardResultEntity standardResult;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getPlaceholder() {
        return placeholder;
    }

    public void setPlaceholder(String placeholder) {
        this.placeholder = placeholder;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public Long getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Long sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getControlType() {
        return controlType;
    }

    public void setControlType(String controlType) {
        this.controlType = controlType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ProjectTaskEntity getProjectTask() {
        return projectTask;
    }

    public void setProjectTask(final ProjectTaskEntity projectTask) {
        this.projectTask = projectTask;
    }

//    public Set<OptionEntryEntity> getOptions() {
//        return options;
//    }
//
//    public void setOptions(Set<OptionEntryEntity> options) {
//        this.options = options;
//    }

//    public OptionEntryEntity getOptions() {
//        return options;
//    }
//
//    public void setOptions(OptionEntryEntity options) {
//        this.options = options;
//    }

    public boolean isShow() {
        return show;
    }

    public void setShow(boolean show) {
        this.show = show;
    }

}
