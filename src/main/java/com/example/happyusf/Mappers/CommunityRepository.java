package com.example.happyusf.Mappers;

import com.example.happyusf.Biz.Common.Domain.CodeInfoDTO;
import com.example.happyusf.Biz.Community.Domain.PostDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Mapper
@Repository
public interface CommunityRepository {
    @Select("SELECT code, code_name_kor FROM common_code_info WHERE major_code ='LMroot'")
    ArrayList<CodeInfoDTO> getCommunityLeftMenu();

    @Select("SELECT post_id, user_id, post_title, post_content, view_count, like_count, reg_date, is_admin_post" +
            " FROM post WHERE community_div = #{community_div} AND post_category = #{post_category}")
    ArrayList<PostDTO> getPosts(PostDTO postDTO);

    @Select("SELECT post_id, user_id, post_title, post_content, view_count, like_count, reg_date, is_admin_post" +
            " FROM post WHERE post_id = #{post_id}")
    PostDTO getPostDetail(int post_id);
}
