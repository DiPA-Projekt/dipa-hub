package online.dipa.hub.tenancy;

import javax.sql.DataSource;

import org.hibernate.engine.jdbc.connections.spi.AbstractDataSourceBasedMultiTenantConnectionProviderImpl;

public class MultiTenantConnectionProviderBean extends AbstractDataSourceBasedMultiTenantConnectionProviderImpl {

    private final TenantProvider tenantProvider;

    public MultiTenantConnectionProviderBean(final TenantProvider tenantProvider) {
        this.tenantProvider = tenantProvider;
    }

    @Override
    protected DataSource selectAnyDataSource() {
        return tenantProvider.getDataSourcesPerTenant()
                             .values()
                             .iterator()
                             .next();
    }

    @Override
    protected DataSource selectDataSource(final String tenantIdentifier) {
        return tenantProvider.getDataSource(tenantIdentifier);
    }
}
