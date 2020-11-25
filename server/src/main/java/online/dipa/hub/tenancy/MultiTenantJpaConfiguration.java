package online.dipa.hub.tenancy;

import java.util.Map;

import javax.persistence.EntityManagerFactory;

import org.hibernate.MultiTenancyStrategy;
import org.hibernate.cfg.Environment;
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

import online.dipa.hub.persistence.entities.ProjectTypeEntity;
import online.dipa.hub.persistence.repositories.Repositories;

@EnableJpaRepositories(basePackageClasses = { Repositories.class })
@EnableTransactionManagement
@Configuration
@EnableConfigurationProperties({ JpaProperties.class, MultiTenantConfigurationProperties.class,
        HibernateProperties.class, LiquibaseProperties.class })
public class MultiTenantJpaConfiguration {

    @Autowired
    private JpaProperties jpaProperties;

    @Autowired
    private HibernateProperties hibernateProperties;

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
    public static EntityManagerFactoryDependsOnPostProcessor LiquibaseEntityManagerFactoryDependsOnPostProcessor() {
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
            final MultiTenantConnectionProvider multiTenantConnectionProvider) {
        final LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();

        entityManagerFactoryBean.setPackagesToScan(ProjectTypeEntity.class.getPackageName());
        entityManagerFactoryBean.setJpaVendorAdapter(jpaVendorAdapter);

        final Map<String, Object> jpaProperties = entityManagerFactoryBean.getJpaPropertyMap();
        jpaProperties.putAll(hibernateProperties.determineHibernateProperties(this.jpaProperties.getProperties(),
                new HibernateSettings()));

        jpaProperties.put(Environment.MULTI_TENANT, MultiTenancyStrategy.DATABASE);
        jpaProperties.put(Environment.MULTI_TENANT_CONNECTION_PROVIDER, multiTenantConnectionProvider);
        jpaProperties.put(Environment.MULTI_TENANT_IDENTIFIER_RESOLVER, currentTenantIdentifierResolver);

        return entityManagerFactoryBean;
    }

    @Bean
    public PlatformTransactionManager transactionManager(final EntityManagerFactory entityManagerFactory) {
        final JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory);

        return transactionManager;
    }

}
