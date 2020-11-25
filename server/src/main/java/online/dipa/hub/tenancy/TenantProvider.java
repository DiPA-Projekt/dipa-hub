package online.dipa.hub.tenancy;

import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.springframework.stereotype.Component;

@Component
public class TenantProvider {

    private final MultiTenantConfigurationProperties multiTenantConfigurationProperties;

    private Map<String, DataSource> dataSources;

    private String defaultTenantId;

    public TenantProvider(final MultiTenantConfigurationProperties multiTenantConfigurationProperties) {
        this.multiTenantConfigurationProperties = multiTenantConfigurationProperties;
    }

    @PostConstruct
    public void initialize() {
        defaultTenantId = multiTenantConfigurationProperties.getDataSources()
                                                            .iterator()
                                                            .next()
                                                            .getTenantId();

        dataSources = multiTenantConfigurationProperties.getDataSources()
                                                        .stream()
                                                        .collect(Collectors.toMap(
                                                                MultiTenantConfigurationProperties.DipaDataSourceProperties::getTenantId,
                                                                d -> d.initializeDataSourceBuilder()
                                                                      .build()));

    }

    public String getDefaultTenantId() {
        return defaultTenantId;
    }

    public boolean isValidTenantId(final String tenantId) {
        return dataSources.containsKey(tenantId);
    }

    public DataSource getDataSource(final String tenantId) {
        return dataSources.get(tenantId);
    }

    public Map<String, DataSource> getDataSourcesPerTenant() {
        return Map.copyOf(dataSources);
    }
}
