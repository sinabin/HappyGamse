package com.example.happyusf.Utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

@Component
public class Scheduler {
    private static final Logger logger = LoggerFactory.getLogger(Scheduler.class);

    @Value("${crawler.location}")
    private String CrawlerPath;

    @Scheduled(cron = "0 5 11 * * *")
    public void Crawling() {

        File file = new File(CrawlerPath);
        ProcessBuilder pb = new ProcessBuilder("python", file.getName());
        pb.directory(file.getParentFile());

        try {
            Process process = pb.start();

            try (BufferedReader outputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                 BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {

                Thread outputThread = new Thread(() -> {
                    String line;
                    try {
                        while ((line = outputReader.readLine()) != null) {
                            logger.info(line); // 또는 로그에 기록합니다.
                        }
                    } catch (IOException e) {
                        logger.error("Error reading process output", e);
                    }
                });

                Thread errorThread = new Thread(() -> {
                    String line;
                    try {
                        while ((line = errorReader.readLine()) != null) {
                            logger.error(line); // 또는 로그에 기록합니다.
                        }
                    } catch (IOException e) {
                        logger.error("Error reading process error", e);
                    }
                });

                outputThread.start();
                errorThread.start();

                outputThread.join();
                errorThread.join();

            }

            int exitCode=process.waitFor();  // 파이썬 프로세스가 완전히 종료될 때까지 대기합니다.
            if(exitCode!=0){
                throw new RuntimeException("Process exited with code: "+exitCode);
            }

        } catch (IOException | InterruptedException e) {
            logger.error("Error during process execution", e);
        }

    }
}
