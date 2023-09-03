package com.example.happyusf.Controller;


import com.example.happyusf.Domain.MessageDTO;
import com.example.happyusf.Domain.SmsResponseDTO;
import com.example.happyusf.Service.NaverCloudService.SmsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

@RestController
public class SmSController {

    private final SmsService smsService;

    @Autowired
    public SmSController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/sms/send")
    public void sendMobileVerificationCode(@RequestBody MessageDTO messageDTO, Model model) throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {

        // 1. 6자리 인증번호 생성
        SecureRandom random = new SecureRandom();
        String code = String.format("%06d", random.nextInt(1000000));
        String content = "[HappyGames] 인증번호 : " + code +"\n인증번호를 입력해주세요";
        messageDTO.setContent(content);

        // 2. 인증번호 발송
        SmsResponseDTO response = smsService.sendSms(messageDTO);
        model.addAttribute("response", response);
    }

}
