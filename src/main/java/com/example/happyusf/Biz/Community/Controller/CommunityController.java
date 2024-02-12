package com.example.happyusf.Biz.Community.Controller;

import com.example.happyusf.Biz.Common.Domain.CodeInfoDTO;
import com.example.happyusf.Biz.Community.Domain.PostDTO;
import com.example.happyusf.Biz.Community.Service.CommunityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/leftMenu")
    public ResponseEntity<Map<String, Object>> getLeftMenuList(){
        Map<String, Object> response = new HashMap<>();
        ArrayList<CodeInfoDTO> leftMenu = communityService.getCommunityLeftMenu();
        response.put("leftMenu", leftMenu);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/posts")
    public ResponseEntity<Map<String, Object>> getPostsList(@RequestBody PostDTO postDTO){
        Map<String, Object> response = new HashMap<>();
        ArrayList<PostDTO> posts = communityService.getPosts(postDTO);
        response.put("posts", posts);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/posts/detail")
    public ResponseEntity<Map<String, Object>> getPostsList(@RequestParam String post_id){
        Map<String, Object> response = new HashMap<>();
        PostDTO postDetail = communityService.getPostDetail(post_id);
        response.put("postDetail", postDetail);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
