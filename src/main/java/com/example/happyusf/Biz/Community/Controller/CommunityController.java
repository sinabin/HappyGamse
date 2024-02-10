package com.example.happyusf.Biz.Community.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @GetMapping("/leftMenu")
    public ResponseEntity<Map<String, Object>> getLeftMenuList(){
        Map<String, Object> response = new HashMap<>();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
