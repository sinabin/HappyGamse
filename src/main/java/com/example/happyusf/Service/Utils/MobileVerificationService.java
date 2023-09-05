package com.example.happyusf.Service.Utils;


import com.example.happyusf.Domain.MobileVerificationCodeDTO;
import com.example.happyusf.Mappers.VerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class MobileVerificationService {
    private final VerificationRepository verificationRepository;

    @Autowired
    public MobileVerificationService(VerificationRepository verificationRepository) {
        this.verificationRepository = verificationRepository;
    }

    public int saveVerificationCode(MobileVerificationCodeDTO mobileVerificationCodeDTO) {
        return verificationRepository.saveVerificationCode(mobileVerificationCodeDTO);
    }

    public MobileVerificationCodeDTO getVerificationResult(MobileVerificationCodeDTO mobileVerificationCodeDTO) {

        // 1. DB에 저장된 발송되고 유효한 인증코드 load
        MobileVerificationCodeDTO dbCodeInfo = verificationRepository.getVerificationCodeINDB(mobileVerificationCodeDTO);
        if (dbCodeInfo == null) {
            mobileVerificationCodeDTO.setVerification_result(false);
            return mobileVerificationCodeDTO;
        }

        // 2. 인증확인
        LocalDateTime currentTime = LocalDateTime.now();
        Duration timeDiff = Duration.between(dbCodeInfo.getSent_time().toLocalDateTime(), currentTime);
        mobileVerificationCodeDTO.setVerification_result(timeDiff.toMinutes() <= 5 && dbCodeInfo.getSent_code().equals(mobileVerificationCodeDTO.getSent_code()));

        if(mobileVerificationCodeDTO.isVerification_result()){ // 인증완료시 해당 핸드폰 번호로 발송된 인증번호 내역들 삭제
            verificationRepository.deleteCompletedNumber(mobileVerificationCodeDTO);
        }

        return mobileVerificationCodeDTO;
    }

}
