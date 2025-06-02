package kr.bigdata.web.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    @GetMapping("/api/hello")
    public String hello(@RequestParam("ck") String ck) {
        System.out.println(ck);
        return "React - Spring Success";
    }
}
