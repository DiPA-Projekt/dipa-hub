package online.dipa.hub.persistence.entities;


import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "elbe_shopping_cart_result")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ELBEShoppingCartResultEntity extends BaseEntity {

    private String resultTypeId;
    private String shoppingCartNumber;
    private String shoppingCartContent;

    private String status;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectTaskEntity projectTask;


    public String getResultTypeId() {
        return resultTypeId;
    }

    public void setResultTypeId(final String resultTypeId) {
        this.resultTypeId = resultTypeId;
    }

    public String getShoppingCartNumber() {
        return shoppingCartNumber;
    }

    public void setShoppingCartNumber(final String shoppingCartNumber) {
        this.shoppingCartNumber = shoppingCartNumber;
    }

    public String getShoppingCartContent() {
        return shoppingCartContent;
    }

    public void setShoppingCartContent(final String shoppingCartContent) {
        this.shoppingCartContent = shoppingCartContent;
    }
    
    public String getStatus() {
        return status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public ProjectTaskEntity getProjectTask() {
        return projectTask;
    }

    public void setProjectTask(final ProjectTaskEntity projectTask) {
        this.projectTask = projectTask;
    }

}
