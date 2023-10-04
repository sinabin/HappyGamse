package com.example.happyusf.Service.Utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
public class CrawlingService {

    private static final Logger logger = LoggerFactory.getLogger(CrawlingService.class);
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
                            logger.info(line);
                        }
                    } catch (IOException e) {
                        logger.error("Error reading process output", e);
                    }
                });

                Thread errorThread = new Thread(() -> {
                    String line;
                    try {
                        while ((line = errorReader.readLine()) != null) {
                            logger.error(line);
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

            int exitCode = process.waitFor();  // 파이썬 프로세스가 완전히 종료될 때까지 대기합니다.
            if (exitCode != 0) {
                throw new RuntimeException("Process exited with code: " + exitCode);
            }

        } catch (IOException | InterruptedException e) {
            logger.error("Error during process execution", e);
        }
    }

}
