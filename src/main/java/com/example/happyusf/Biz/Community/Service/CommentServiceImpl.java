package com.example.happyusf.Biz.Community.Service;

import com.example.happyusf.Biz.Community.Domain.CommentDTO;
import com.example.happyusf.Mappers.CommunityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;


/**
 * @Explain 댓글 관련 서비스 구현클래스
 */
@Service
public class CommentServiceImpl implements CommentService {
    private final CommunityRepository communityRepository;

    public CommentServiceImpl(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    /**
     * 지정된 게시물의 모든 댓글을 조회
     * @param post_id 게시물 ID
     * @return 댓글 목록
     */
    public ArrayList<CommentDTO> getComments(String post_id){
        return communityRepository.getComments(Integer.parseInt(post_id));
    }

    /**
     * @Explain 댓글을 생성
     * @param commentDTO 생성할 댓글 데이터
     * @return 생성 성공 여부
     */
    public boolean createComment(CommentDTO commentDTO){
        return communityRepository.createComment(commentDTO) > 0;
    }

    /**
     * @Explain 댓글의 좋아요 수를 업데이트하고 투표 정보를 추가
     * @param commentDTO 투표할 댓글 데이터
     * @return 업데이트 성공 여부
     */
    @Transactional
    public boolean updateLikeCountAndInsertVoted(CommentDTO commentDTO) {
        boolean isUpdated = updateLikeCount(commentDTO);
        insertVoted(commentDTO);
        return isUpdated;
    }


    /**
     * @Explain 댓글의 좋아요 수를 업데이트
     * @param commentDTO 업데이트할 댓글 데이터
     * @return 업데이트 성공 여부
     * @throws IllegalArgumentException 좋아요 수가 1 또는 -1이 아닌 경우 예외 발생
     */
    public boolean updateLikeCount(CommentDTO commentDTO) {
        int likeCount = commentDTO.getLike_count();
        if (likeCount == 1 || likeCount == -1) {
            return communityRepository.updateLikeCount(commentDTO) > 0;
        } else {
            throw new IllegalArgumentException("좋아요 수는 1 또는 -1이어야 합니다.");
        }
    }

    /**
     * @Explain 사용자가 특정 댓글에 대해 투표했는지 여부를 조회합
     * @param commentDTO 조회할 댓글 데이터
     * @return 투표 정보를 담은 CommentDTO
     */
    public CommentDTO getHasVoted(CommentDTO commentDTO){
        return communityRepository.getHasVoted(commentDTO);
    }

    /**
     * @Explain 사용자의 투표 정보를 데이터베이스에 추가
     * @param commentDTO 추가할 투표 정보
     * @return 추가 성공 여부
     */
    public boolean insertVoted(CommentDTO commentDTO){
        return communityRepository.insertVoted(commentDTO) > 0;
    }

    /**
     * @Explain 사용자의 투표를 업데이트합니다.
     *          이미 투표한 경우 투표 유형을 변경하고, 해당 변경에 따라 댓글의 좋아요 수를 조정
     * @param commentDTO 업데이트할 투표 정보
     * @return 업데이트 성공 여부
     */
    @Transactional
    public boolean updateVote(CommentDTO commentDTO) {
        // 현재 투표 상태 확인
        CommentDTO currentVote = communityRepository.getHasVoted(commentDTO);
        if (currentVote != null) {
            // 투표 유형이 변경되는 경우에만 처리
            if (currentVote.getVote_type() != (commentDTO.getLike_count())) {
                // 투표 유형 업데이트
                boolean voteUpdated = communityRepository.updateVote(commentDTO) > 0;
                if (voteUpdated) {
                    // like_count 업데이트: 기존에 추천 투표이었다면 -1, 비추천이었다면 +1 조정
                    int likeCountAdjustment = currentVote.getVote_type() == 1 ? -1 : 1;
                    // 이번 요청의 투표 유형이 추천이면 +1, 비추천이면 -1 추가 조정
                    likeCountAdjustment += commentDTO.getLike_count() == 1 ? 1 : -1;
                    // 조정된 like_count 설정
                    commentDTO.setLike_count_adjustment(likeCountAdjustment);
                    communityRepository.adjustLikeCount(commentDTO);
                }
                return voteUpdated;
            }
        } else {
            // 첫 투표인 경우
            boolean voteInserted = insertVoted(commentDTO);
            if (voteInserted) {
                // like_count 업데이트: 추천이면 +1, 비추천이면 -1
                commentDTO.setLike_count_adjustment(commentDTO.getLike_count() == 1 ? 1 : -1);
                communityRepository.adjustLikeCount(commentDTO);
            }
            return voteInserted;
        }
        return false;
    }

}
