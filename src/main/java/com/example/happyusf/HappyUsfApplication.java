package com.example.happyusf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling // 스케쥴링 활성화
@SpringBootApplication
public class HappyUsfApplication {

    public static void main(String[] args) {
        SpringApplication.run(HappyUsfApplication.class, args);
    }

}
