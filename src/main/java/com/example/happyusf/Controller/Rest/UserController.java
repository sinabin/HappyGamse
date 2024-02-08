package com.example.happyusf.Controller.Rest;

import com.example.happyusf.Domain.MessageDTO;
import com.example.happyusf.Domain.UserDTO;
import com.example.happyusf.Service.NaverCloudService.SmsService;
import com.example.happyusf.Service.UserService.UserRepositoryService;
import com.example.happyusf.Utils.Validator;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
public class UserController {

    private final UserRepositoryService userRepositoryService;

    private final SmsService smsService;

    private final SpringValidatorAdapter validator;

    @Autowired
    public UserController(UserRepositoryService userRepositoryService, SmsService smsService, SpringValidatorAdapter validator) {
        this.userRepositoryService = userRepositoryService;
        this.smsService = smsService;
        this.validator = validator;
    }

    /**
     * @param userDTO
     * @param bindingResult
     * @Explain 회원가입 요청 처리 API
     */
    @PostMapping("/request/join")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserDTO userDTO, BindingResult bindingResult) {
        userRepositoryService.joinNewUser(userDTO);
        return new ResponseEntity<>("회원 가입이 완료되었습니다.", HttpStatus.OK);
    }

    /**
     * @param messageDTO
     * @Explain 회원 ID 찾기 요청 처리 API
     */
    @PostMapping("/request/findIdByMobile")
    public ResponseEntity<String> findIdByMobile(@RequestBody MessageDTO messageDTO, BindingResult bindingResult) {
        // 1. DB 조회
        UserDTO userDTO = userRepositoryService.findIdByMobile(messageDTO);
        if (userDTO == null) {
            throw new IllegalArgumentException("해당 핸드폰 번호로 등록된 ID가 존재하지 않습니다.");
        } else {
            try {
                // 2. ID 발송
                messageDTO.setContent("[HappyGames] 요청하신 아이디는 " + userDTO.getUser_id() + "입니다.");
                smsService.sendSms(messageDTO);
            } catch (JsonProcessingException | UnsupportedEncodingException | NoSuchAlgorithmException |
                     InvalidKeyException | URISyntaxException e) {
                throw new RuntimeException(e.getMessage());
            }
        }

        return new ResponseEntity<>("회원가입시 등록되었던 핸드폰 번호로 요청하신 ID가 발송되었습니다.", HttpStatus.OK);
    }

    /**
     * @param userDTO(user_id, new_password, phone_number)
     * @Explain 비밀번호 재설정 요청처리 API
     */
    @PostMapping("/request/resetPasswordByMobile")
    public ResponseEntity<String> resetPasswordByMobile(@Valid @RequestBody UserDTO userDTO, BindingResult bindingResult, Authentication authentication) {
        // 1. password에 대해서만 Validation 수행하도록 설정
        validator.validateProperty(userDTO, "password");

        // 2. password 필드에 대한 유효성 검사 결과 확인
        if (bindingResult.hasFieldErrors("password")) {
            return new ResponseEntity<>(bindingResult.getFieldError("password").getDefaultMessage(), HttpStatus.BAD_REQUEST);
        }

        // 3. 요청된 비밀번호 재설정 처리
        userDTO.setUser_id(authentication.getName());
        int result = userRepositoryService.resetPassword(userDTO);
        String response = "";

        if (result > 0) {
            response = "해당 핸드폰번호로 가입된 회원 ID의 비밀번호가 성공적으로 재설정되었습니다.";
        } else {
            response = "인증받은 핸드폰번호에 등록된 ID와 입력한 ID가 일치하지 않습니다.";
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }



    /**
     * @param Authentication(user_id)
     * @Explain MyPage 요청처리
     */
    @PostMapping("/user/myPage")
    public ResponseEntity<UserDTO> myPageUserInfo(Authentication authentication) {
        UserDTO response = userRepositoryService.myPageUserinfo(authentication.getName());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
