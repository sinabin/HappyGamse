package com.example.happyusf.Biz.Community.Controller;

import com.example.happyusf.Biz.Community.Domain.CommentDTO;
import com.example.happyusf.Biz.Community.Service.CommunityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CommentController {

    private final CommunityService communityService;

    public CommentController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/api/community/posts/detail/comments")
    public ResponseEntity<Map<String, Object>> getComments(@RequestParam String post_id){
        Map<String, Object> response = new HashMap<>();
        ArrayList<CommentDTO> comments = communityService.getComments(post_id);
        response.put("comments", comments);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/user/api/community/posts/detail/comments")
    public ResponseEntity<Map<String, Object>> createComment(@RequestBody CommentDTO commentDTO, Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        commentDTO.setUser_id(authentication.getName());
        boolean isCreated = communityService.createComment(commentDTO);
        response.put("isCreated", isCreated);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
