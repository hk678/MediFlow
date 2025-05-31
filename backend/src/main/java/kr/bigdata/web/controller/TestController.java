package kr.bigdata.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
public class TestController {

    @CrossOrigin(origins = "http://localhost:3001") // React 포트 허용
    @ResponseBody
    @RequestMapping(value = "/api/hello", method = RequestMethod.GET)
    public String hello(@RequestParam("ck") String ck) {
    	System.out.println(ck);
        return "React - Spring Success";
    }
}
