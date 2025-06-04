package kr.bigdata.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "kr.bigdata.web")
@EnableJpaRepositories(basePackages = "kr.bigdata.web.repository")
@EntityScan(basePackages = "kr.bigdata.web.entity")
public class MediFlowApplication {

	public static void main(String[] args) {
		SpringApplication.run(MediFlowApplication.class, args);
	}

}
