package com.example.happyusf.Mappers;


import com.example.happyusf.Domain.NewsPagesDTO;
import com.example.happyusf.Domain.PagingDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Mapper
@Repository
public interface NewsPageRespository {

    @Select("SELECT news_id, news_title, news_desc, url, created_date FROM news_pages ORDER BY created_date DESC LIMIT #{page}, #{size}")
    ArrayList<NewsPagesDTO> getNewsList(PagingDTO pagingDTO);

    @Select("SELECT count(news_id) as total_count FROM news_pages")
    int getNewsTotalCount();

    @Select("SELECT * FROM news_pages WHERE news_id = #{news_id}")
    NewsPagesDTO getNewsPage(String news_id);

}
