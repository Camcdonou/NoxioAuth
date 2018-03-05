package org.infpls.noxio.auth.core;

import org.springframework.context.annotation.*;
import org.springframework.web.servlet.config.annotation.*;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "org.infpls.noxio.auth")
@PropertySource("classpath:noxio.properties")
public class AppConfig extends WebMvcConfigurerAdapter {
  
  @Value("${sql.driver}")
  private String driver;
  @Value("${sql.url}")
  private String url;
  @Value("${sql.user}")
  private String user;
  @Value("${sql.pass}")
  private String pass;

  @Override
  public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
    configurer.enable();
  }

  @Bean
  public DataSource datasource_mydb() {
      DataSource ds = new DataSource();
      ds.setDriverClassName(driver);
      ds.setUrl(url);
      ds.setUsername(user);
      ds.setPassword(pass);
      return ds;
  }

  @Bean
  public JdbcTemplate jdbcTemplate(DataSource dataSource) {
      return new JdbcTemplate(dataSource);
  }
}

