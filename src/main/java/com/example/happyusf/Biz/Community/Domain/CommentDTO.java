package com.example.happyusf.Biz.Community.Domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDTO {
    private int comment_id;
    private int post_id;
    private String user_id;
    private int parent_comment_id;
    private String content;
    private String reg_date;
    private int like_count;
    private int vote_type;
    private int  like_count_adjustment;
}
