package com.example.happyusf.Mappers;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface ResourceRepository {

    @Select("SELECT resource FROM page_resource WHERE resource_name = #{resource_name}")
    String findPageResource(String resource_name);
}
