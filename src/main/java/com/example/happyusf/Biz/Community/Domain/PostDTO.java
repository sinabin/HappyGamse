package com.example.happyusf.Biz.Community.Domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDTO {
    int post_id;
    String community_div;
    String post_category;
    String user_id;
    String post_title;
    String post_content;
    int view_count;
    int like_count;
    String reg_date;
}
