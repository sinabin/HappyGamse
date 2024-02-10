package com.example.happyusf.Biz.Common.Domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Explain DB의 공통코드 테이블 Data 처리용 DTO
 */
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
