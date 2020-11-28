package online.dipa.hub.tenancy;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class MultiTenantIdentificationFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(MultiTenantIdentificationFilter.class);

    @Override
    protected void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response,
            final FilterChain filterChain) throws ServletException, IOException {
        final String tenantId = request.getServerName()
                                       .split("\\.")[0];
        LOGGER.debug("Tenant id in request: {}", tenantId);

        CurrentTenantContextHolder.setTenantId(tenantId);

        filterChain.doFilter(request, response);

        CurrentTenantContextHolder.clearTenantId();
    }
}
