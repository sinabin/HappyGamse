package com.example.happyusf.Mappers;

import com.example.happyusf.Biz.Common.Domain.CodeInfoDTO;
import com.example.happyusf.Biz.Community.Domain.CommentDTO;
import com.example.happyusf.Biz.Community.Domain.PostDTO;
import org.apache.ibatis.annotations.*;
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

    @Select("SELECT comment_id, user_id, parent_comment_id, content, like_count, reg_date" +
            " FROM comments WHERE post_id = #{post_id}")
    ArrayList<CommentDTO> getComments(int post_id);

    @Insert("INSERT INTO comments(post_id, user_id, parent_comment_id, content, reg_date) " +
            "VALUE (#{post_id}, #{user_id}, #{parent_comment_id} , #{content}, sysdate())")
    int createComment(CommentDTO commentDTO);

    @Update("UPDATE comments set like_count =  comments.like_count + #{like_count} WHERE comment_id = #{comment_id}")
    int updateLikeCount(CommentDTO commentDTO);

    @Select("SELECT comment_id, vote_type FROM comment_votes WHERE comment_id =#{comment_id} AND user_id = #{user_id}")
    CommentDTO getHasVoted(CommentDTO commentDTO);

    @Insert("INSERT INTO comment_votes(user_id, comment_id, vote_type) VALUE (#{user_id}, #{comment_id}, #{like_count})")
    int insertVoted(CommentDTO commentDTO);

    @Update("UPDATE comment_votes SET vote_type = #{like_count} WHERE user_id = #{user_id} AND comment_id = #{comment_id}")
    int updateVote(CommentDTO commentDTO);

    @Update("UPDATE comments SET like_count = like_count + #{like_count_adjustment} WHERE comment_id = #{comment_id}")
    int adjustLikeCount(CommentDTO commentDTO);

    @Select("SELECT comments.like_count FROM comments WHERE comment_id = #{comment_id}")
    CommentDTO getCurrentLikeCount(CommentDTO commentDTO);

    @Update("UPDATE post SET post_title =#{post_title}, post_content =#{post_content} WHERE post_id = #{post_id} AND user_id = #{user_id}")
    int updatePost(PostDTO postDTO);

    @Delete("DELETE FROM post WHERE post_id = #{post_id} AND user_id = #{user_id}")
    int deletePost(PostDTO postDTO);

}
