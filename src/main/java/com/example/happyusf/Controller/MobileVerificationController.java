package com.example.happyusf.Controller;


import com.example.happyusf.Domain.MessageDTO;
import com.example.happyusf.Domain.MobileVerificationCodeDTO;
import com.example.happyusf.Service.Utils.MobileVerificationService;
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
import java.security.SecureRandom;

@RestController
public class MobileVerificationController {

    private final MobileVerificationService mobileVerificationService;

    private static final SecureRandom random = new SecureRandom();
    @Autowired
    public MobileVerificationController(MobileVerificationService mobileVerificationService) {
        this.mobileVerificationService = mobileVerificationService;
    }

    /**
     * @param messageDTO : 핸드폰 번호
     * @Explain : 회원가입시 핸드폰 인증번호 요청 처리 API
     */
    @PostMapping("/request/verificationCode")
    public ResponseEntity<?> sendMobileVerificationCode(@Valid @RequestBody MessageDTO messageDTO, BindingResult bindingResult) {
        try {
            // 기등록 회원과 중복된 휴대폰 번호 검사
            mobileVerificationService.findDuplicatePhoneNumber(messageDTO.getTo());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return mobileVerificationService.processMobileVerification(messageDTO, bindingResult);
    }

    /**
     * @param messageDTO : 핸드폰 번호
     * @Explain : 회원가입시 핸드폰 인증번호 요청 처리 API
     */
    @PostMapping("/request/account/verificationCode")
    public ResponseEntity<?> sendMobileVerificationCodeForPW(@Valid @RequestBody MessageDTO messageDTO, BindingResult bindingResult) {
        return mobileVerificationService.processMobileVerification(messageDTO, bindingResult);
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
