package com.example.happyusf.Domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AgreementHistoryDTO {
    int agreement_id;
    String user_id;
    boolean service_agreement;
    boolean private_info_agreement;
    boolean GPS_info_agreement;
    boolean promotion_agreement;
}
