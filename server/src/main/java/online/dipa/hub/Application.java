package online.dipa.hub;

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
import org.springframework.http.HttpStatus;

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
            LOGGER.info("Adding Default 404-Page: /index.html");
            container.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/index.html"));
        };
    }
}
