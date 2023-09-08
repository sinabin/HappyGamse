package com.example.happyusf.Domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Pattern;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MobileVerificationCodeDTO {

    @Pattern(regexp = "^\\d{3}-\\d{3,4}-\\d{4}$", message = "전화번호는 XXX-XXXX-XXXX 형식으로 입력해주세요.")
    private String phone_number;

    @Pattern(regexp = "\\d{6}", message = "인증코드는 6자리입니다.")
    private String sent_code;

    private Timestamp sent_time;

    private boolean verification_result;
}
