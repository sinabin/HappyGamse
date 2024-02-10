package com.example.happyusf.Utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

@Slf4j  //Logger 인스턴스 자동 생성
@Service
public class CrawlingService {

    @Value("${crawler.location}")
    private String CrawlerPath;

    public void GamemecaCrawling() {
        File file = new File(CrawlerPath);
        ProcessBuilder pb = new ProcessBuilder("python3", file.getName());
        pb.directory(file.getParentFile());

        try {
            Process process = pb.start();

            try (BufferedReader outputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                 BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {

                Thread outputThread = new Thread(() -> {
                    String line;
                    try {
                        while ((line = outputReader.readLine()) != null) {
                            log.info(line);
                        }
                    } catch (IOException e) {
                        log.error("Error reading process output", e);
                    }
                });

                Thread errorThread = new Thread(() -> {
                    String line;
                    try {
                        while ((line = errorReader.readLine()) != null) {
                            log.error(line);
                        }
                    } catch (IOException e) {
                        log.error("Error reading process error", e);
                    }
                });

                outputThread.start();
                errorThread.start();

                outputThread.join();
                errorThread.join();

            }

            int exitCode = process.waitFor();  // 파이썬 프로세스가 완전히 종료될 때까지 대기
            if (exitCode != 0) {
                throw new RuntimeException("Process exited with code: " + exitCode);
            }

        } catch (IOException | InterruptedException e) {
            log.error("Error during process execution", e);
        }
    }

}
