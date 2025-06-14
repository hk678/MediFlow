package kr.bigdata.web.config;

import kr.bigdata.web.service.BedInfoService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class MockServiceConfig {

    @Bean
    @Primary
    public BedInfoService bedInfoService() {
        return new BedInfoService() {
            @Override
            public long getAvailableCount() {
                return 3L;
            }

            @Override
            public long getTotalCount() {
                return 10L;
            }
        };
    }
}
