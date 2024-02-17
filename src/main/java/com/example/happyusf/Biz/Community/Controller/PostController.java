package com.example.happyusf.Biz.Community.Controller;

import com.example.happyusf.Biz.Common.Domain.CodeInfoDTO;
import com.example.happyusf.Biz.Community.Domain.PostDTO;
import com.example.happyusf.Biz.Community.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/api/community/leftMenu")
    public ResponseEntity<Map<String, Object>> getLeftMenuList(){
        Map<String, Object> response = new HashMap<>();
        ArrayList<CodeInfoDTO> leftMenu = postService.getCommunityLeftMenu();
        response.put("leftMenu", leftMenu);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/api/community/posts")
    public ResponseEntity<Map<String, Object>> getPostsList(@RequestBody PostDTO postDTO){
        Map<String, Object> response = new HashMap<>();
        ArrayList<PostDTO> posts = postService.getPosts(postDTO);
        response.put("posts", posts);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/api/community/posts/detail")
    public ResponseEntity<Map<String, Object>> getPostsList(@RequestParam String post_id){
        Map<String, Object> response = new HashMap<>();
        PostDTO postDetail = postService.getPostDetail(post_id);
        response.put("postDetail", postDetail);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/user/api/community/posts/update")
    public ResponseEntity<Map<String, Object>> updatePost(@RequestBody PostDTO postDTO) {
        Map<String, Object> response = new HashMap<>(); HttpStatus status;
        boolean updateResult = postService.updatePost(postDTO);
        response.put("result", updateResult);
        status = updateResult ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(response, status);
    }

    @DeleteMapping("/user/api/community/posts/delete")
    public ResponseEntity<Map<String, Object>> deletePost(@RequestBody PostDTO postDTO) {
        Map<String, Object> response = new HashMap<>(); HttpStatus status;
        boolean deleteResult = postService.deletePost(postDTO);
        response.put("result", deleteResult);
        status = deleteResult ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(response, status);
    }


}
