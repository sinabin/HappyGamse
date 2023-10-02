package com.example.happyusf.Controller.Rest;


import com.example.happyusf.Domain.NewsPagesDTO;
import com.example.happyusf.Domain.PagingDTO;
import com.example.happyusf.Service.NewsPageService.NewsPageRepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class GameNewsController {

    private final NewsPageRepositoryService newsPageRepositoryService;

    @Autowired
    public GameNewsController(NewsPageRepositoryService newsPageRepositoryService) {
        this.newsPageRepositoryService = newsPageRepositoryService;
    }

    @GetMapping("/news/list")
    public ResponseEntity<Map<String, Object>> getNewsList
            (@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {

        PagingDTO pagingDTO = new PagingDTO();
        pagingDTO.setPage( (page-1)*10 );
        pagingDTO.setSize(size);

        List<NewsPagesDTO> newsList = newsPageRepositoryService.getNewsList(pagingDTO);
        int totalCount = newsPageRepositoryService.getTotalNewsDataCount();
        pagingDTO.setTotal_count(totalCount);

        Map<String, Object> response = new HashMap<>();

        response.put("paging", pagingDTO);
        response.put("newsList", newsList);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @GetMapping("/news/detail")
    public ResponseEntity<NewsPagesDTO> getNewsPage(@RequestParam String news_id){
        NewsPagesDTO result = newsPageRepositoryService.getNewsPage(news_id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}