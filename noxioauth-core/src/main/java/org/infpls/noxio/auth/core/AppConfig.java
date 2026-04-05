package org.infpls.noxio.auth.core;

import org.springframework.context.annotation.*;
import org.springframework.web.servlet.config.annotation.*;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.infpls.noxio.auth.module.auth.util.Settable;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "org.infpls.noxio.auth")
public class AppConfig extends WebMvcConfigurerAdapter {

  @Override
  public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
    configurer.enable();
  }

  @Bean
  public DataSource noxio_datasource() {
      Settable.update();                   // This call to Settable.update() ensures all properties are loaded before we start using them.
      DataSource ds = new DataSource();
      ds.setDriverClassName(Settable.getSqlDriver());
      ds.setUrl(Settable.getSqlUrl());
      ds.setUsername(Settable.getSqlUser());
      ds.setPassword(Settable.getSqlPass());

      // Connection pool configuration to prevent timeouts and stale connections
      ds.setInitialSize(5);                    // Start with 5 connections
      ds.setMaxActive(20);                     // Max 20 active connections
      ds.setMaxIdle(10);                       // Max 10 idle connections
      ds.setMinIdle(5);                        // Min 5 idle connections
      ds.setMaxWait(30000);                    // Wait max 30s for connection

      // Connection validation - test connections before use
      ds.setTestOnBorrow(true);                // Validate when borrowing from pool
      ds.setTestWhileIdle(true);               // Validate idle connections
      ds.setValidationQuery("SELECT 1");       // Simple validation query

      // Timeout settings - close connections before MySQL does
      ds.setMinEvictableIdleTimeMillis(600000); // Close idle after 10 min
      ds.setTimeBetweenEvictionRunsMillis(60000); // Check every minute
      ds.setRemoveAbandoned(true);              // Remove abandoned connections
      ds.setRemoveAbandonedTimeout(300);        // After 5 min of inactivity

      return ds;
  }

  @Bean
  public JdbcTemplate jdbcTemplate(DataSource dataSource) {
      return new JdbcTemplate(dataSource);
  }
  
  @Bean(name = "multipartResolver")
  public CommonsMultipartResolver multiPartResolver(){

      CommonsMultipartResolver resolver = new CommonsMultipartResolver();
      return resolver;
  }
}

