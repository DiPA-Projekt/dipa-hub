package online.dipa.hub.tenancy;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CurrentTenantIdentifierResolverBean implements CurrentTenantIdentifierResolver {

    private static final Logger LOGGER = LoggerFactory.getLogger(CurrentTenantIdentifierResolverBean.class);

    private final TenantProvider tenantProvider;

    public CurrentTenantIdentifierResolverBean(final TenantProvider tenantProvider) {
        this.tenantProvider = tenantProvider;
    }

    @Override
    public String resolveCurrentTenantIdentifier() {
        final String tenantId = CurrentTenantContextHolder.getTenantId();
        if (!tenantProvider.isValidTenantId(tenantId)) {
            LOGGER.info("Unkown tenant id '{}', falling back to default tenant.", tenantId);
            return tenantProvider.getDefaultTenantId();
        }
        return tenantId;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}
