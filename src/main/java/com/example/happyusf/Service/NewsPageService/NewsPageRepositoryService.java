package com.example.happyusf.Service.NewsPageService;


import com.example.happyusf.Domain.NewsPagesDTO;
import com.example.happyusf.Domain.PagingDTO;
import com.example.happyusf.Mappers.NewsPageRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class NewsPageRepositoryService {

    private final NewsPageRespository newsPageRespository;

    @Autowired
    public NewsPageRepositoryService(NewsPageRespository newsPageRespository) {
        this.newsPageRespository = newsPageRespository;
    }

    public ArrayList<NewsPagesDTO> getNewsList(PagingDTO pagingDTO){
        return newsPageRespository.getNewsList(pagingDTO);
    }

    public int getTotalNewsDataCount(){
        return newsPageRespository.getNewsTotalCount();
    }

    public NewsPagesDTO getNewsPage(String news_id){
        return newsPageRespository.getNewsPage(news_id);
    }

}
