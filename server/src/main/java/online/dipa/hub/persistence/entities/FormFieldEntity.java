package online.dipa.hub.persistence.entities;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import online.dipa.hub.api.model.FormField;

import javax.persistence.*;


import java.util.HashSet;
import java.util.Set;

import static javax.persistence.CascadeType.ALL;

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

    @OneToMany(mappedBy = "formField")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<OptionEntryEntity> options = new HashSet<>();

    @ManyToOne(fetch = FetchType.EAGER)
    private ResultEntity result;

    public FormFieldEntity() {
        super();
    }

    public FormFieldEntity(FormField formField) {
        this.key = formField.getKey();
        this.value = formField.getValue();
        this.label = formField.getLabel();
        this.placeholder = formField.getLabel();
        this.required = formField.getRequired();
        this.placeholder = formField.getPlaceholder();
        this.sortOrder = formField.getSortOrder();
        this.controlType = formField.getControlType().toString();
        this.type = formField.getType().toString();
//        this.options = formField.getOptions();
        this.show = formField.getShow();
    }

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

    public ResultEntity getResultEntity() {
        return result;
    }

    public void setResultEntity(final ResultEntity result) {
        this.result = result;
    }

    public Set<OptionEntryEntity> getOptions() {
        return options;
    }

    public void setOptions(Set<OptionEntryEntity> options) {
        this.options = options;
    }

    public boolean isShow() {
        return show;
    }

    public void setShow(boolean show) {
        this.show = show;
    }

}
