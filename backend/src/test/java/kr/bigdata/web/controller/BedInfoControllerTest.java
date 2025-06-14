package kr.bigdata.web.controller;

import kr.bigdata.web.config.MockServiceConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Import(MockServiceConfig.class) // ✅ 이거 필수!
public class BedInfoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetERBedCount() throws Exception {
        mockMvc.perform(get("/api/beds/er-count"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.available").value(3))
            .andExpect(jsonPath("$.total").value(10));
    }
}
