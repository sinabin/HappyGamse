package com.example.happyusf.Controller;

import com.example.happyusf.Domain.User;
import com.example.happyusf.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestController {
    private final UserService userService;

    @Autowired
    public TestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/test")
    public List<User> test() {
        return userService.getAllUserList();
    }

}
