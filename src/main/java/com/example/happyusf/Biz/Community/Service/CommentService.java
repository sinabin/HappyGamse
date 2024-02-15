package com.example.happyusf.Biz.Community.Service;

import com.example.happyusf.Biz.Community.Domain.CommentDTO;

import java.util.ArrayList;

/**
 * @Explain 댓글 관련 서비스 인터페이스 정의
 */
public interface CommentService {

    ArrayList<CommentDTO> getComments(String post_id);  // 특정 게시글의 모든 댓글을 조회
    boolean createComment(CommentDTO commentDTO); // 댓글 생성
    CommentDTO getHasVoted(CommentDTO commentDTO);  // 특정 댓글에 대해 사용자가 투표(추천/비추천)를 했는지 확인하는 메서드. 투표 정보를 담은 CommentDTO 반환
    boolean updateLikeCountAndInsertVoted(CommentDTO commentDTO);  // 사용자의 첫 투표를 처리하고 해당 댓글의 좋아요 수를 업데이트하는 메서드. 성공 여부 반환
    boolean updateVote(CommentDTO commentDTO); // 사용자의 투표를 업데이트하는 메서드. 이미 투표한 경우 투표 유형을 변경하고, 해당 변경에 따라 댓글의 좋아요 수를 조정. 성공 여부 반환
}
