package online.dipa.hub.tenancy;

import java.util.List;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("dipa.tenants")
public class MultiTenantConfigurationProperties {

    private List<DipaDataSourceProperties> dataSources;

    public List<DipaDataSourceProperties> getDataSources() {
        return dataSources;
    }

    public void setDataSources(final List<DipaDataSourceProperties> dataSources) {
        this.dataSources = dataSources;
    }

    public static class DipaDataSourceProperties extends DataSourceProperties {

        private String tenantId;

        public String getTenantId() {
            return tenantId;
        }

        public void setTenantId(final String tenantId) {
            this.tenantId = tenantId;
        }
    }
}
