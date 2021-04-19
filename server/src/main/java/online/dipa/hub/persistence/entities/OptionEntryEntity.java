package online.dipa.hub.persistence.entities;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "option_entry")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OptionEntryEntity extends BaseEntity {

    @Size(max = 255)
    @NotNull
    @Basic(optional = false)
    @Column(unique = true)
    private String key;

    @Basic
    private String value;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private FormFieldEntity formField;

    public OptionEntryEntity() {
        super();
    }

    public OptionEntryEntity(OptionEntryEntity opetionEntry) {
        this.key = opetionEntry.getKey();
        this.value = opetionEntry.getValue();
    }

    public String getKey() {
        return key;
    }

    public void setKey(final String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public FormFieldEntity getFormField() {
        return formField;
    }

    public void setFormField(final FormFieldEntity formField) {
        this.formField = formField;
    }
}
