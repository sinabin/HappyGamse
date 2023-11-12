package com.example.happyusf.Domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CodeInfoDTO {
    private String code;
    private String code_name_kor;
    private String code_name_eng;
    private String major_code;
    private String use_yn;
    private String code_desc;
    private String reg_id;
    private String reg_date;
    private String reg_ip;
    private String mod_id;
    private String mod_date;
    private String mod_ip;

}
