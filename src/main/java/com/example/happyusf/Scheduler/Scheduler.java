package com.example.happyusf.Scheduler;

import com.example.happyusf.Utils.CrawlingService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Scheduler {

    private final CrawlingService crawlingService;

    public Scheduler(CrawlingService crawlingService) {
        this.crawlingService = crawlingService;
    }

    @Scheduled(cron = "0 5 * * * *")
    public void Crawling() {
        crawlingService.GamemecaCrawling();
    }
}
