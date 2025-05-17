package com.example.happyusf.Mappers;

import com.example.happyusf.Biz.Mail.DTO.EmailVerificationCodeDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface EmailVerificationRepository {

    @Insert("INSERT INTO email_verification_codes (email, sent_code, sent_time) VALUES (#{email}, #{sent_code}, #{sent_time})")
    int saveEmailVerificationCode(EmailVerificationCodeDTO emailVerificationCodeDTO);
}
