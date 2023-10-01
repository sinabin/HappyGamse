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

public class NewsPagesDTO {

    private String news_id; // 식별자
    private String news_title; // 뉴스 기사 제목
    private String news_desc; // 기사 요약문
    private String news_content;// 뉴스 본문
    private Timestamp ai_date; // AI가 요약문을 작성한 날짜
    private String ai_result; // AI가 작성한 뉴스 요약문
    private String url; // 기사 원문 url
    private Timestamp created_date; // 기사 작성일
}
