package com.example.happyusf.Controller;

import com.example.happyusf.Domain.UserDTO;
import com.example.happyusf.Service.UserService.UserRepositoryService;
import org.mybatis.spring.MyBatisSystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class PageDataController {

    private final UserRepositoryService userRepositoryService;

    @Autowired
    public PageDataController(UserRepositoryService userRepositoryService) {
        this.userRepositoryService = userRepositoryService;
    }

    @PostMapping("/request/join")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserDTO userDTO, BindingResult bindingResult) {

        if(bindingResult.hasErrors()){
            StringBuilder errorMessage = new StringBuilder();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errorMessage.append(error.getDefaultMessage()).append("\n");
            }
            return new ResponseEntity<>(errorMessage.toString(), HttpStatus.BAD_REQUEST);
        }

        try {
            int result = userRepositoryService.joinNewUser(userDTO);
            return new ResponseEntity<>("회원 가입이 완료되었습니다.", HttpStatus.OK);
        }catch (IllegalArgumentException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT); // status code : 409 -> 비즈니스 로직 충돌 예외 처리(중복 아이디)
        }
        catch (MyBatisSystemException e) {
            return new ResponseEntity<>("회원정보를 저장하는 도중 서버에서 에러가 발생하였습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
