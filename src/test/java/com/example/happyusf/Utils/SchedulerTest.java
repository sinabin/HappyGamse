package com.example.happyusf.Utils;

import com.example.happyusf.Scheduler.Scheduler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SchedulerTest {

    @Autowired
    Scheduler scheduler;

    @Test
    void testCrawling(){
        scheduler.Crawling();
    }

}
