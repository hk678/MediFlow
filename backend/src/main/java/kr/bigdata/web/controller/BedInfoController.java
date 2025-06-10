package kr.bigdata.web.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.bigdata.web.service.BedInfoService;

@RestController
@RequestMapping("/api/beds")
public class BedInfoController {
    @Autowired
    private BedInfoService bedInfoService;

    // GET /api/beds/er-count
    @GetMapping("/er-count")
    public Map<String, Long> getERBedCount() {
        long available = bedInfoService.getAvailableCount();
        long total = bedInfoService.getTotalCount();
        Map<String, Long> map = new HashMap<>();
        map.put("available", available);
        map.put("total", total);
        return map;
    }
}
