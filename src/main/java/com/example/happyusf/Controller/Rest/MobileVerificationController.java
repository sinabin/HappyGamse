package com.example.happyusf.Controller.Rest;


import com.example.happyusf.Domain.MessageDTO;
import com.example.happyusf.Domain.MobileVerificationCodeDTO;
import com.example.happyusf.Service.MobileService.MobileVerificationService;
import com.example.happyusf.Utils.Validator;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
public class MobileVerificationController {

    private final MobileVerificationService mobileVerificationService;

    @Autowired
    public MobileVerificationController(MobileVerificationService mobileVerificationService) {
        this.mobileVerificationService = mobileVerificationService;
    }

    /**
     * @param messageDTO : 핸드폰 번호
     * @Explain : 회원가입시 핸드폰 인증번호 요청 처리 API
     */
    @PostMapping("/request/verificationCode")
    public ResponseEntity<?> sendMobileVerificationCode(@Valid @RequestBody MessageDTO messageDTO, BindingResult bindingResult) throws UnsupportedEncodingException, URISyntaxException, NoSuchAlgorithmException, InvalidKeyException, JsonProcessingException {
        // 기등록 회원과 중복된 휴대폰 번호 검사
        Validator.validateRequest(bindingResult);
        mobileVerificationService.findDuplicatePhoneNumber(messageDTO.getTo());
        return mobileVerificationService.processMobileVerification(messageDTO, bindingResult);
    }

    /**
     * @param messageDTO : 핸드폰 번호
     * @Explain : 회원가입시 핸드폰 인증번호 요청 처리 API
     */
    @PostMapping("/request/account/verificationCode")
    public ResponseEntity<?> sendMobileVerificationCodeForPW(@Valid @RequestBody MessageDTO messageDTO, BindingResult bindingResult) throws UnsupportedEncodingException, URISyntaxException, NoSuchAlgorithmException, InvalidKeyException, JsonProcessingException {
        Validator.validateRequest(bindingResult);
        return mobileVerificationService.processMobileVerification(messageDTO, bindingResult);
    }


    /**
     * @param  : 핸드폰 번호
     * @Explain : 핸드폰 인증번호 요청 처리 API
     */
    @PostMapping("/request/verification")
    public ResponseEntity<?> sendMobileVerificationResult(@Valid @RequestBody MobileVerificationCodeDTO mobileVerificationCodeDTO, BindingResult bindingResult) {
        Validator.validateRequest(bindingResult);
        return mobileVerificationService.getVerificationResult(mobileVerificationCodeDTO);
    }


}
