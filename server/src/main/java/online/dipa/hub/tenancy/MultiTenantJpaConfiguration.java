package online.dipa.hub.tenancy;

import online.dipa.hub.persistence.entities.OperationTypeEntity;
import online.dipa.hub.persistence.repositories.Repositories;
import org.hibernate.MultiTenancyStrategy;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.jpa.EntityManagerFactoryDependsOnPostProcessor;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateProperties;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.AbstractJpaVendorAdapter;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import java.util.Map;

@EnableJpaRepositories(basePackageClasses = { Repositories.class })
@EnableTransactionManagement
@Configuration
@EnableConfigurationProperties({ JpaProperties.class, MultiTenantConfigurationProperties.class,
        HibernateProperties.class, LiquibaseProperties.class })
public class MultiTenantJpaConfiguration {

    @Autowired
    private JpaProperties jpaProperties;

    @Autowired
    private LiquibaseProperties liquibaseProperties;

    @Autowired
    private MultiTenantConfigurationProperties multiTenantConfigurationProperties;

    @Bean
    public MultiTenantConnectionProvider multiTenantConnectionProvider(final TenantProvider tenantProvider) {
        return new MultiTenantConnectionProviderBean(tenantProvider);
    }

    @Bean
    public CurrentTenantIdentifierResolver currentTenantIdentifierResolver(final TenantProvider tenantProvider) {
        return new CurrentTenantIdentifierResolverBean(tenantProvider);
    }

    @Bean
    public static EntityManagerFactoryDependsOnPostProcessor liquibaseEntityManagerFactoryDependsOnPostProcessor() {
        return new EntityManagerFactoryDependsOnPostProcessor(MultiTenantLiquibase.class);
    }

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {
        final AbstractJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        adapter.setShowSql(jpaProperties.isShowSql());
        if (jpaProperties.getDatabase() != null) {
            adapter.setDatabase(jpaProperties.getDatabase());
        }
        if (jpaProperties.getDatabasePlatform() != null) {
            adapter.setDatabasePlatform(jpaProperties.getDatabasePlatform());
        }
        adapter.setGenerateDdl(jpaProperties.isGenerateDdl());
        return adapter;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(final JpaVendorAdapter jpaVendorAdapter,
            final CurrentTenantIdentifierResolver currentTenantIdentifierResolver,
            final MultiTenantConnectionProvider multiTenantConnectionProvider,
            final HibernateProperties hibernateProperties) {
        final LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();

        entityManagerFactoryBean.setPackagesToScan(OperationTypeEntity.class.getPackageName());
        entityManagerFactoryBean.setJpaVendorAdapter(jpaVendorAdapter);

        final Map<String, Object> properties = entityManagerFactoryBean.getJpaPropertyMap();
        properties.putAll(hibernateProperties.determineHibernateProperties(this.jpaProperties.getProperties(),
                new HibernateSettings()));

        properties.put(AvailableSettings.MULTI_TENANT, MultiTenancyStrategy.DATABASE);
        properties.put(AvailableSettings.MULTI_TENANT_CONNECTION_PROVIDER, multiTenantConnectionProvider);
        properties.put(AvailableSettings.MULTI_TENANT_IDENTIFIER_RESOLVER, currentTenantIdentifierResolver);

        return entityManagerFactoryBean;
    }

    @Bean
    public PlatformTransactionManager transactionManager(final EntityManagerFactory entityManagerFactory) {
        final JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory);

        return transactionManager;
    }

}
