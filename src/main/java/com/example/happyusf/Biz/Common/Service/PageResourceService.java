package com.example.happyusf.Biz.Common.Service;

/**
 * @Explain 페이지 리소스를 관리하는 서비스의 인터페이스 정의
 */
public interface PageResourceService {
    String findPageResource(String resource_name); // 주어진 리소스 이름에 해당하는 페이지 리소스를 찾아서 반환
}
