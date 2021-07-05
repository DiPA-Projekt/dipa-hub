package online.dipa.hub;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.web.embedded.tomcat.ConfigurableTomcatWebServerFactory;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.AbstractResourceResolver;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import online.dipa.hub.tenancy.MultiTenantJpaConfiguration;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class,
        DataSourceTransactionManagerAutoConfiguration.class })
@Import(MultiTenantJpaConfiguration.class)
@EnableDiscoveryClient
public class Application {

    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);

    public static void main(final String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public WebServerFactoryCustomizer<ConfigurableTomcatWebServerFactory> containerCustomizer() {
        return container -> {
            container.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/v1/index.html"));
        };
    }

    @Bean
    WebMvcConfigurer configurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addResourceHandlers(final ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/**")
                        .addResourceLocations("classpath:/static/", "/static/")
                        .resourceChain(false)
                        .addResolver(new SPADefaultResolver())
                        .addResolver(new PathResourceResolver());
            }
        };
    }

    private static final class SPADefaultResolver extends AbstractResourceResolver {

        @Override
        protected Resource resolveResourceInternal(final HttpServletRequest request, final String requestPath,
                final List<? extends Resource> locations, final ResourceResolverChain chain) {
            final Resource resource = chain.resolveResource(request, requestPath, locations);
            if (resource != null) {
                return resource;
            }
            if (requestPath.startsWith("v1")) {
                return chain.resolveResource(request, "v1/index.html", locations);
            }
            if (requestPath.startsWith("v2")) {
                return chain.resolveResource(request, "v2/index.html", locations);
            }
            return null;
        }

        @Override
        protected String resolveUrlPathInternal(final String resourceUrlPath, final List<? extends Resource> locations,
                final ResourceResolverChain chain) {
            return chain.resolveUrlPath(resourceUrlPath, locations);
        }
    }
}
