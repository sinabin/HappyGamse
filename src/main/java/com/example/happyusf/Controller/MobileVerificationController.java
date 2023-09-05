package com.example.happyusf.Controller;


import com.example.happyusf.Domain.MessageDTO;
import com.example.happyusf.Domain.MobileVerificationCodeDTO;
import com.example.happyusf.Domain.SmsResponseDTO;
import com.example.happyusf.Service.NaverCloudService.SmsService;
import com.example.happyusf.Service.Utils.MobileVerificationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;

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
    public ResponseEntity<SmsResponseDTO> sendMobileVerificationCode(@RequestBody MessageDTO messageDTO) throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {

        // 1. 6자리 인증번호 생성
        SecureRandom random = new SecureRandom();
        String code = String.format("%06d", random.nextInt(1000000));
        String content = "[HappyGames] 인증번호 : " + code +"\n인증번호를 입력해주세요";
        messageDTO.setContent(content);

        // 2. 인증번호 발송
        SmsResponseDTO response = smsService.sendSms(messageDTO);
        Timestamp currentTime = Timestamp.valueOf(LocalDateTime.now());

        // 3. 발송내역 DB저장
        MobileVerificationCodeDTO mobileVerificationCodeDTO =
                MobileVerificationCodeDTO.builder().phone_number(messageDTO.getTo())
                        .sent_code(code)
                        .sent_time(currentTime)
                        .build();

        mobileVerificationService.saveVerificationCode(mobileVerificationCodeDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * @param  : 핸드폰 번호
     * @Explain : 핸드폰 인증번호 요청 처리 API
     */
    @PostMapping("/request/verification")
    public ResponseEntity<MobileVerificationCodeDTO> sendMobileVerificationResult(@RequestBody MobileVerificationCodeDTO mobileVerificationCodeDTO) throws RestClientException {
        MobileVerificationCodeDTO verification_result =  mobileVerificationService.getVerificationResult(mobileVerificationCodeDTO);
        return ResponseEntity.ok(verification_result);
    }

}
