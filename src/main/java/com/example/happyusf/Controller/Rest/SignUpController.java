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
import org.springframework.validation.BindingResult;
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
public class SignUpController {

    private final UserRepositoryService userRepositoryService;

    private final SmsService smsService;

    @Autowired
    public SignUpController(UserRepositoryService userRepositoryService, SmsService smsService) {
        this.userRepositoryService = userRepositoryService;
        this.smsService = smsService;
    }

    /**
     * @param userDTO
     * @param bindingResult
     * @Explain 회원가입 요청 처리 API
     */
    @PostMapping("/request/join")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserDTO userDTO, BindingResult bindingResult) {
        Validator.validateRequest(bindingResult);
        userRepositoryService.joinNewUser(userDTO);
        return new ResponseEntity<>("회원 가입이 완료되었습니다.", HttpStatus.OK);
    }

    /**
     * @param messageDTO
     * @Explain 회원 ID 찾기 요청 처리 API
     */
    @PostMapping("/request/findIdByMobile")
    public ResponseEntity<String> findIdByMobile(@Valid @RequestBody MessageDTO messageDTO, BindingResult bindingResult) {
        Validator.validateRequest(bindingResult);

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
     * @param userDTO
     * @Explain 비밀번호 재설정 요청처리 API
     */
    @PostMapping("/request/resetPasswordByMobile")
    public ResponseEntity<String> resetPasswordByMobile(@RequestBody UserDTO userDTO) {

        // 1. 데이터 정규성 검사
        Pattern password_pattern = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#()\\-=+])[A-Za-z\\d@$!%*?&#()\\-=+]{10,}$");
        Matcher matcher = password_pattern.matcher(userDTO.getPassword());
        if (!matcher.matches()) {
            return new ResponseEntity<>("비밀번호는 최소 하나의 소문자, 대문자, 숫자 및 특수 문자를 포함해야하며 길이가 10 이상이어야 합니다.", HttpStatus.BAD_REQUEST);
        }
        // 2. 요청된 비밀번호 재설정 처리
        userRepositoryService.resetPassword(userDTO);
        return new ResponseEntity<>("해당 핸드폰번호로 가입된 회원 ID의 비밀번호가 성공적으로 재설정되었습니다.", HttpStatus.OK);
    }

}
