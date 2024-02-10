package com.example.happyusf.Biz.User.Domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SmsVerificationDTO {
    String verificationCode;
    boolean is_expired;
}
