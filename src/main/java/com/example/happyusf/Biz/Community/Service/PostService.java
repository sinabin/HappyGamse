package com.example.happyusf.Biz.Community.Service;

import com.example.happyusf.Biz.Common.Domain.CodeInfoDTO;
import com.example.happyusf.Biz.Community.Domain.PostDTO;

import java.util.ArrayList;

public interface PostService {
    public ArrayList<CodeInfoDTO> getCommunityLeftMenu();
    ArrayList<PostDTO> getPosts(PostDTO postDTO);
    PostDTO getPostDetail(String post_id);
}
