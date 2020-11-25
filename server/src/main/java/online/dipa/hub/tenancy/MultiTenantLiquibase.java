package online.dipa.hub.tenancy;

import java.util.Map;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.stereotype.Component;

import liquibase.exception.LiquibaseException;
import liquibase.integration.spring.SpringLiquibase;

@Component
public class MultiTenantLiquibase {

    private static final Logger LOGGER = LoggerFactory.getLogger(MultiTenantLiquibase.class);

    private final LiquibaseProperties liquibaseProperties;
    private final Map<String, DataSource> dataSourcesPerTentant;

    public MultiTenantLiquibase(final LiquibaseProperties liquibaseProperties, final TenantProvider tenantProvider) {
        this.liquibaseProperties = liquibaseProperties;
        dataSourcesPerTentant = tenantProvider.getDataSourcesPerTenant();
    }

    @PostConstruct
    public void migrateDataSources() throws LiquibaseException {
        LOGGER.info("Starting Liquibase migration of all tenants.");

        for (final Map.Entry<String, DataSource> entry : dataSourcesPerTentant.entrySet()) {
            migrateTenant(entry.getKey(), entry.getValue());
        }
        LOGGER.info("Finished Liquibase migration of all tenants.");
    }

    public void migrateTenant(final String tenantId, final DataSource dataSource) throws LiquibaseException {
        LOGGER.info("Migrating datasource for tenant: {}", tenantId);

        final SpringLiquibase springLiquibase = createSpringLiquibase(dataSource, tenantId);
        springLiquibase.afterPropertiesSet();

        LOGGER.info("Finished migration for tenant: {}", tenantId);
    }

    public SpringLiquibase createSpringLiquibase(final DataSource dataSource, final String tenantId) {
        final SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(dataSource);
        liquibase.setChangeLog(liquibaseProperties.getChangeLog());
        liquibase.setClearCheckSums(liquibaseProperties.isClearChecksums());
        liquibase.setContexts(getContexts(tenantId));
        liquibase.setDefaultSchema(liquibaseProperties.getDefaultSchema());
        liquibase.setLiquibaseSchema(liquibaseProperties.getLiquibaseSchema());
        liquibase.setLiquibaseTablespace(liquibaseProperties.getLiquibaseTablespace());
        liquibase.setDatabaseChangeLogTable(liquibaseProperties.getDatabaseChangeLogTable());
        liquibase.setDatabaseChangeLogLockTable(liquibaseProperties.getDatabaseChangeLogLockTable());
        liquibase.setDropFirst(liquibaseProperties.isDropFirst());
        liquibase.setShouldRun(liquibaseProperties.isEnabled());
        liquibase.setLabels(liquibaseProperties.getLabels());
        liquibase.setChangeLogParameters(liquibaseProperties.getParameters());
        liquibase.setRollbackFile(liquibaseProperties.getRollbackFile());
        liquibase.setTestRollbackOnUpdate(liquibaseProperties.isTestRollbackOnUpdate());
        liquibase.setTag(liquibaseProperties.getTag());
        return liquibase;
    }

    private String getContexts(final String tenantId) {
        String contexts = tenantId;
        if (liquibaseProperties.getContexts() != null) {
            contexts += "," + liquibaseProperties.getContexts();
        }
        return contexts;
    }

}
