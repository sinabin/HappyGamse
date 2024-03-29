package com.example.happyusf.Biz.Channel.Domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChannelInfoDTO {

    @NotNull
    private String c_id; // 채널 id
    @NotNull
    private String c_title; // 채널명
    @NotNull
    private String c_desc; // 채널 소개
    @NotNull
    private String c_type; // 채널 타입 (open, private)

    private String c_password; // private 채널의 password
    @NotNull
    private String c_subject; // 채널 주제 (플레이게임)
    @NotNull
    @Max(value = 20, message = "채널 최대 인원은 20명을 초과할 수 없습니다.")
    private Integer c_maxUser; // 채널 최대 인원
    @NotNull
    private Integer c_heartCount; // 채널 인기지표
    @NotNull
    private boolean c_isAlive; // 채널 활성화 여부
    @NotNull
    private String c_master; // 채널주인
}
