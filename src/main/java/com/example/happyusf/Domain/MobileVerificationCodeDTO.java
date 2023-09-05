package com.example.happyusf.Domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MobileVerificationCodeDTO {
    private String phone_number;
    private String sent_code;
    private Timestamp sent_time;
    private boolean verification_result;
}
