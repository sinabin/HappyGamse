package com.example.happyusf.Service.Utils;


import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class CodeGenerator {

    public String generateMobileVerificationCode(){
        SecureRandom rnd = new SecureRandom();
        String code = String.format("%06d", rnd.nextInt(1000000));
        return code;
    }

}
