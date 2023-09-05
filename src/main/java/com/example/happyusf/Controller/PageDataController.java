package com.example.happyusf.Controller;

import com.example.happyusf.Domain.UserDTO;
import com.example.happyusf.Service.UserService.UserRepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PageDataController {

    private final UserRepositoryService userRepositoryService;

    @Autowired
    public PageDataController(UserRepositoryService userRepositoryService) {
        this.userRepositoryService = userRepositoryService;
    }

    @PostMapping("/request/join")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        try {
            int result = userRepositoryService.joinNewUser(userDTO);
            return new ResponseEntity<>("회원 가입이 완료되었습니다.", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}
