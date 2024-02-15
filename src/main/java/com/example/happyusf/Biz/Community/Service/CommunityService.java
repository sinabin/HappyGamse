package com.example.happyusf.Biz.Community.Service;

import com.example.happyusf.Biz.Common.Domain.CodeInfoDTO;
import com.example.happyusf.Biz.Community.Domain.CommentDTO;
import com.example.happyusf.Biz.Community.Domain.PostDTO;
import com.example.happyusf.Mappers.CommunityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public boolean updateLikeCountAndInsertVoted(CommentDTO commentDTO) {
        boolean isUpdated = updateLikeCount(commentDTO);
        insertVoted(commentDTO);
        return isUpdated;
    }

    public boolean updateLikeCount(CommentDTO commentDTO) {
        int likeCount = commentDTO.getLike_count();
        if (likeCount == 1 || likeCount == -1) {
            return communityRepository.updateLikeCount(commentDTO) > 0;
        } else {
            throw new IllegalArgumentException("좋아요 수는 1 또는 -1이어야 합니다.");
        }
    }

    public CommentDTO getHasVoted(CommentDTO commentDTO){
        return communityRepository.getHasVoted(commentDTO);
    }

    public boolean insertVoted(CommentDTO commentDTO){
        return communityRepository.insertVoted(commentDTO) > 0;
    }

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
