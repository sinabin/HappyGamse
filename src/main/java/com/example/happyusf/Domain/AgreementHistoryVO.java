package com.example.happyusf.Domain;

import lombok.Data;

@Data
public class AgreementHistoryVO {
    int agreement_id;
    String user_id;
    boolean service_agreement;
    boolean private_info_agreement;
    boolean GPS_info_agreement;
    boolean promotion_agreement;

}
