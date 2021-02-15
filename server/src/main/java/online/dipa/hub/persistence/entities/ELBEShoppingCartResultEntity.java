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

    private String shopingCartNumber;
    private String shopingCartContent;

    private String status;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private ProjectTaskEntity projectTask;

    public String getShoppingCartNumber() {
        return shopingCartNumber;
    }

    public void setShoppingCartNumber(final String shopingCartNumber) {
        this.shopingCartNumber = shopingCartNumber;
    }

    public String getShoppingCartContent() {
        return shopingCartContent;
    }

    public void setShoppingCartContent(final String shopingCartContent) {
        this.shopingCartContent = shopingCartContent;
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
