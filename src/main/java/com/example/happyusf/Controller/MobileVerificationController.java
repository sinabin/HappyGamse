package com.example.happyusf.Controller;


import com.example.happyusf.Domain.MessageDTO;
import com.example.happyusf.Domain.MobileVerificationCodeDTO;
import com.example.happyusf.Domain.SmsResponseDTO;
import com.example.happyusf.Service.NaverCloudService.SmsService;
import com.example.happyusf.Service.Utils.MobileVerificationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.coyote.Response;
import org.mybatis.spring.MyBatisSystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@RestController
public class MobileVerificationController {

    private final SmsService smsService;
    private final MobileVerificationService mobileVerificationService;

    @Autowired
    public MobileVerificationController(SmsService smsService, MobileVerificationService mobileVerificationService) {
        this.smsService = smsService;
        this.mobileVerificationService = mobileVerificationService;
    }

    /**
     * @param messageDTO : 핸드폰 번호
     * @Explain : 핸드폰 인증번호 요청 처리 API
     */
    @PostMapping("/request/verificationCode")
    public ResponseEntity<?> sendMobileVerificationCode(@Valid @RequestBody MessageDTO messageDTO, BindingResult bindingResult ) {

        if (bindingResult.hasErrors()) {
            // messageDTO의 유효성 검사
            String errorMessage = bindingResult.getFieldError().getDefaultMessage();
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }

        SmsResponseDTO response;

        try {
            // 1. 6자리 인증번호 생성
            SecureRandom random = new SecureRandom();
            String code = String.format("%06d", random.nextInt(1000000));
            String content = "[HappyGames] 인증번호 : " + code +"인증번호를 입력해주세요";
            messageDTO.setContent(content);

            // 2. 인증번호 발송
            try {
                response = smsService.sendSms(messageDTO);
            } catch (RestClientException e) {
                return new ResponseEntity<>("SMS service is currently unavailable.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            Timestamp currentTime = Timestamp.valueOf(LocalDateTime.now());

            // 3. 발송내역 DB저장
            MobileVerificationCodeDTO mobileVerificationCodeDTO =
                    MobileVerificationCodeDTO.builder().phone_number(messageDTO.getTo())
                            .sent_code(code)
                            .sent_time(currentTime)
                            .build();

            try {
                mobileVerificationService.saveVerificationCode(mobileVerificationCodeDTO);
            } catch (MyBatisSystemException e) {
                return new ResponseEntity<>("Failed to save verification code in the database.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (JsonProcessingException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (URISyntaxException | InvalidKeyException | NoSuchAlgorithmException | UnsupportedEncodingException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return ResponseEntity.ok(response);
    }



    /**
     * @param  : 핸드폰 번호
     * @Explain : 핸드폰 인증번호 요청 처리 API
     */
    @PostMapping("/request/verification")
    public ResponseEntity<?> sendMobileVerificationResult(@Valid @RequestBody MobileVerificationCodeDTO mobileVerificationCodeDTO, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            StringBuilder errorMessage = new StringBuilder();
            for(FieldError fieldError : bindingResult.getFieldErrors()){
                errorMessage.append(fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorMessage.toString(), HttpStatus.BAD_REQUEST);
        }

        try {
            MobileVerificationCodeDTO verification_result =  mobileVerificationService.getVerificationResult(mobileVerificationCodeDTO);
            return ResponseEntity.ok(verification_result);
        } catch (RestClientException e) {
            return new ResponseEntity<>("Error while verifying mobile number: ", HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
