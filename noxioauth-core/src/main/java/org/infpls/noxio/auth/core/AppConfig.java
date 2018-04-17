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

