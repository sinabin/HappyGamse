package com.example.happyusf.Biz.Community.Controller;

import com.example.happyusf.Biz.Community.Domain.CommentDTO;
import com.example.happyusf.Biz.Community.Service.CommunityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
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

    /**
     * @param post_id
     * @return 해당 post의 모든 댓글을 반환
     */
    @GetMapping("/api/community/posts/detail/comments")
    public ResponseEntity<Map<String, Object>> getComments(@RequestParam String post_id){
        Map<String, Object> response = new HashMap<>();
        ArrayList<CommentDTO> comments = communityService.getComments(post_id);
        response.put("comments", comments);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * @Explain 댓글 작성 처리
     * @param commentDTO
     * @param authentication
     * @return 댓글 작성 성공 여부
     */
    @PostMapping("/user/api/community/posts/detail/comments")
    public ResponseEntity<Map<String, Object>> createComment(@RequestBody CommentDTO commentDTO, Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        commentDTO.setUser_id(authentication.getName());
        boolean isCreated = communityService.createComment(commentDTO);
        response.put("isCreated", isCreated);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * @Explain 사용자가 특정 댓글에 대해 투표했는지 여부를 조회
     * @param commentDTO - comment_id
     * @param authentication - user_id
     * @return ResponseEntity -  'hasVoted' : 투표 여부
     */
    @GetMapping("/user/api/comments/hasVoted")
    public ResponseEntity<Map<String, Object>> getHasVoted(@ModelAttribute CommentDTO commentDTO, Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        commentDTO.setUser_id(authentication.getName());
        CommentDTO hasVoted = communityService.getHasVoted(commentDTO);
        response.put("hasVoted", hasVoted);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * @Explain 사용자의 첫 투표를 처리하고, 해당 댓글의 좋아요 수를 업데이트.
     * @param commentDTO - comment_id, vote_type(추천/비추천)
     * @param authentication - user_id
     * @return ResponseEntity isUpdated -  요청 성공 여부
     */
    @Transactional
    @PostMapping("/user/api/comments/firstVote")
    public ResponseEntity<Map<String, Object>> updateLikeCount(@RequestBody CommentDTO commentDTO, Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        commentDTO.setUser_id(authentication.getName());
        boolean isCreated = communityService.updateLikeCountAndInsertVoted(commentDTO);
        response.put("isUpdated", isCreated);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * @Explain 사용자의 투표를 업데이트, 이미 투표한 경우 투표 유형을 변경하고, 해당 변경에 따라 댓글의 좋아요 수를 조정.
     * @param commentDTO commentDTO - comment_id, vote_type(추천/비추천)
     * @param authentication - user_id
     * @return ResponseEntity - 'isUpdated' 요청 성공여부
     */
    @Transactional
    @PostMapping("/user/api/comments/updateVote")
    public ResponseEntity<Map<String, Object>> updateVote(@RequestBody CommentDTO commentDTO, Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        commentDTO.setUser_id(authentication.getName()); // 현재 인증된 사용자 ID 설정
        boolean isUpdated = communityService.updateVote(commentDTO); // 투표 업데이트 처리
        response.put("isUpdated", isUpdated);
        return new ResponseEntity<>(response, HttpStatus.OK); // 상태 코드를 CREATED에서 OK로 변경할 수 있음
    }

}
