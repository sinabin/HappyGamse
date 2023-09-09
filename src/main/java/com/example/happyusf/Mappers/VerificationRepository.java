package com.example.happyusf.Mappers;


import com.example.happyusf.Domain.MobileVerificationCodeDTO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface VerificationRepository {

    @Insert("INSERT INTO verification_codes (phone_number, sent_code, sent_time) VALUES (#{phone_number}, #{sent_code}, #{sent_time})")
    int saveVerificationCode(MobileVerificationCodeDTO mobileVerificationCodeDTO);

    @Select("SELECT * FROM verification_codes WHERE phone_number = #{phone_number} AND sent_code = #{sent_code} ORDER BY sent_time DESC LIMIT 1")
    MobileVerificationCodeDTO getVerificationCodeINDB(MobileVerificationCodeDTO mobileVerificationCodeDTO);

    @Delete("DELETE FROM verification_codes WHERE phone_number = #{phone_number}")
    int deleteCompletedNumber(MobileVerificationCodeDTO mobileVerificationCodeDTO);

    @Select("SELECT COUNT(phone_number) FROM user_info where phone_number = #{phone_number}")
    int findDuplicatePhoneNumber(String phone_number);
}
