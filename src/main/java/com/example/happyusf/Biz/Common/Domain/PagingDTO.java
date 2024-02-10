package com.example.happyusf.Biz.Common.Domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PagingDTO {

    private int page; // 현재 페이지 번호
    private int size; // 한 페이지에 보여줄 데이터의 개수
    private int total_count; // 총 Data 수


}
