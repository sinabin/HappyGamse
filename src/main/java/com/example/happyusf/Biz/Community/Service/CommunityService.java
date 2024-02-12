package com.example.happyusf.Biz.Community.Service;

import com.example.happyusf.Biz.Common.Domain.CodeInfoDTO;
import com.example.happyusf.Biz.Community.Domain.CommentDTO;
import com.example.happyusf.Biz.Community.Domain.PostDTO;
import com.example.happyusf.Mappers.CommunityRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CommunityService {
    private final CommunityRepository communityRepository;

    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    public ArrayList<CodeInfoDTO> getCommunityLeftMenu(){
        return communityRepository.getCommunityLeftMenu();
    }

    public ArrayList<PostDTO> getPosts(PostDTO postDTO){
        return communityRepository.getPosts(postDTO);
    }

    public PostDTO getPostDetail(String post_id){
        return communityRepository.getPostDetail(Integer.parseInt(post_id));
    }

    public ArrayList<CommentDTO> getComments(String post_id){
        return communityRepository.getComments(Integer.parseInt(post_id));
    }
    public boolean createComment(CommentDTO commentDTO){
        return communityRepository.createComment(commentDTO) > 0;
    }
}
