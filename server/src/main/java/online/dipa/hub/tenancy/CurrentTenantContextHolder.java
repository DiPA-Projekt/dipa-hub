package online.dipa.hub.tenancy;

import org.springframework.util.Assert;

public class CurrentTenantContextHolder {

    private static final ThreadLocal<String> contextHolder = new InheritableThreadLocal<>();

    public static void clearTenantId() {
        contextHolder.remove();
    }

    public static String getTenantId() {
        return contextHolder.get();
    }

    public static void setTenantId(final String context) {
        Assert.notNull(context, "Only non-null tenant-ids are permitted");
        contextHolder.set(context);
    }
}
