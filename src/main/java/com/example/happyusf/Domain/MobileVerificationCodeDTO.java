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

    private String phone_number;

    @Pattern(regexp = "\\d{6}", message = "인증코드는 6자리입니다.")
    private String sent_code;

    private Timestamp sent_time;

    private boolean verification_result;
}
