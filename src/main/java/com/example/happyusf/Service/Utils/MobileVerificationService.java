package com.example.happyusf.Service.Utils;


import com.example.happyusf.Domain.MessageDTO;
import com.example.happyusf.Domain.MobileVerificationCodeDTO;
import com.example.happyusf.Domain.SmsResponseDTO;
import com.example.happyusf.Exception.PhoneNumberAlreadyExistsException;
import com.example.happyusf.Mappers.VerificationRepository;
import com.example.happyusf.Service.NaverCloudService.SmsService;
import com.example.happyusf.Utils.Const;
import com.example.happyusf.Utils.Validator;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.mybatis.spring.MyBatisSystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.client.RestClientException;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class MobileVerificationService {
    private final VerificationRepository verificationRepository;
    private final SmsService smsService;
    private static final SecureRandom random = new SecureRandom();

    @Autowired
    public MobileVerificationService(VerificationRepository verificationRepository, SmsService smsService) {
        this.verificationRepository = verificationRepository;
        this.smsService = smsService;
    }


    /**
     * @param mobileVerificationCodeDTO
     * @Explain 인증번호 발송내역 DB 저장
     */
    public int saveVerificationCode(MobileVerificationCodeDTO mobileVerificationCodeDTO) {
        return verificationRepository.saveVerificationCode(mobileVerificationCodeDTO);
    }

    /**
     * @param mobileVerificationCodeDTO
     * @Explain 완료 및 불필요한 인증번호 발송 내역 Delete
     */
    public int deleteCompletedNumber(MobileVerificationCodeDTO mobileVerificationCodeDTO) {
        return verificationRepository.deleteCompletedNumber(mobileVerificationCodeDTO);
    }

    /**
     * @param mobileVerificationCodeDTO
     * @Explain 인증번호의 인증 처리 메소드
     */
    public ResponseEntity<?> getVerificationResult(MobileVerificationCodeDTO mobileVerificationCodeDTO) {

        // 1. DB에 저장된 발송되고 유효한 인증코드 load
        MobileVerificationCodeDTO dbCodeInfo = verificationRepository.getVerificationCodeINDB(mobileVerificationCodeDTO);
        if (dbCodeInfo == null) {
            mobileVerificationCodeDTO.setVerification_result(false);
            return ResponseEntity.ok(mobileVerificationCodeDTO);
        }

        // 2. 인증확인
        LocalDateTime currentTime = LocalDateTime.now();
        Duration timeDiff = Duration.between(dbCodeInfo.getSent_time().toLocalDateTime(), currentTime);
        mobileVerificationCodeDTO.setVerification_result(timeDiff.toMinutes() <= 5 && dbCodeInfo.getSent_code().equals(mobileVerificationCodeDTO.getSent_code()));

        if (mobileVerificationCodeDTO.isVerification_result()) { // 인증완료시 해당 핸드폰 번호로 발송된 인증번호 내역들 삭제
            deleteCompletedNumber(mobileVerificationCodeDTO);
        }

        return ResponseEntity.ok(mobileVerificationCodeDTO);
    }

    public Integer findDuplicatePhoneNumber(String phone_number) {

        // phone_number 중복검사
        phone_number = phone_number.replaceAll("-", "");
        int result = verificationRepository.findDuplicatePhoneNumber(phone_number);
        if (result != 0) {
            throw new PhoneNumberAlreadyExistsException("이미 등록된 휴대폰 번호입니다.");
        }


        return result;

    }

    /**
     * @param messageDTO
     * @param bindingResult
     * @Explain 인증번호 발송 메소드
     */
    public ResponseEntity<?> processMobileVerification(MessageDTO messageDTO, BindingResult bindingResult) throws UnsupportedEncodingException, URISyntaxException, NoSuchAlgorithmException, InvalidKeyException, JsonProcessingException {
        SmsResponseDTO response;

        // 1. 6자리 인증번호 생성
        String code = String.format("%06d", random.nextInt(1000000));
        String content = "[HappyGames] 인증번호 : " + code + "인증번호를 입력해주세요";
        messageDTO.setContent(content);
        messageDTO.setTo(messageDTO.getTo().replaceAll("-", ""));

        // 2. 인증번호 발송
        response = smsService.sendSms(messageDTO);

        Timestamp currentTime = Timestamp.valueOf(LocalDateTime.now());

        MobileVerificationCodeDTO mobileVerificationCodeDTO =
                MobileVerificationCodeDTO.builder().phone_number(messageDTO.getTo())
                        .sent_code(code)
                        .sent_time(currentTime)
                        .build();

        // 3. 이전 발송 내역 clean
        deleteCompletedNumber(mobileVerificationCodeDTO);

        // 4. 신규 발송내역 DB저장
        saveVerificationCode(mobileVerificationCodeDTO);

        return new ResponseEntity<>("인증번호가 발송되었습니다.", HttpStatus.OK);
    }

}
