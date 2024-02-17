package com.example.happyusf.Biz.Community.Service;

import com.example.happyusf.Biz.Common.Domain.CodeInfoDTO;
import com.example.happyusf.Biz.Community.Domain.PostDTO;
import com.example.happyusf.Mappers.CommunityRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class PostServiceImpl implements PostService{
    private final CommunityRepository communityRepository;

    public PostServiceImpl(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    @Override
    public ArrayList<CodeInfoDTO> getCommunityLeftMenu(){
        return communityRepository.getCommunityLeftMenu();
    }

    @Override
    public ArrayList<PostDTO> getPosts(PostDTO postDTO) {
        return communityRepository.getPosts(postDTO);
    }

    @Override
    public PostDTO getPostDetail(String post_id) {
        return communityRepository.getPostDetail(Integer.parseInt(post_id));
    }

    @Override
    public boolean updatePost(PostDTO postDTO) {
        return communityRepository.updatePost(postDTO) > 0;
    }

    @Override
    public boolean deletePost(PostDTO postDTO) {
        return communityRepository.deletePost(postDTO) > 0 ;
    }
}
