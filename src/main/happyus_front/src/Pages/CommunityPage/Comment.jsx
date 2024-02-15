import React, {useEffect, useState} from 'react';
import './Comment.css';
import axiosInstance from "../../contexts/axiosInstance";
import ReplyComment from "./ReplyComment";

const Comment = ({ postId }) => {
    // 댓글 관련 state
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');

    // 답글 내용을 객체로 관리
    const [replyContents, setReplyContents] = useState({});
    const [replyStates, setReplyStates] = useState({});
    const [activeReplyId, setActiveReplyId] = useState(null);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        const response = await axiosInstance.get(`/api/community/posts/detail/comments?post_id=${postId}`);
        const fetchedComments = response.data.comments;

        // 댓글들을 부모 ID에 따라 그룹화 및 최상위 부모 ID 설정
        const commentMap = {};
        fetchedComments.forEach((comment) => {
            commentMap[comment.comment_id] = {
                ...comment,
                replies: [],
            };
        });

        // 최상위 부모 ID 찾는 함수
        const findTopLevelParentId = (commentId) => {
            let parentId = commentMap[commentId].parent_comment_id;
            while (parentId && commentMap[parentId].parent_comment_id) {
                parentId = commentMap[parentId].parent_comment_id;
            }
            return parentId || commentId;
        };

        // 각 댓글에 최상위 부모 ID 설정
        Object.keys(commentMap).forEach((commentId) => {
            const topParentId = findTopLevelParentId(commentId);
            commentMap[commentId].top_level_parent_id = topParentId;
            if (commentMap[commentId].parent_comment_id) {
                commentMap[commentMap[commentId].parent_comment_id].replies.push(commentMap[commentId]);
            }
        });

        // 부모 댓글만을 포함하는 배열 생성
        const parentComments = Object.values(commentMap).filter((comment) => !comment.parent_comment_id);
        setComments(parentComments);
    };


    const handleVote = async (commentId, voteType) => {
        const voteCheckResponse = await axiosInstance.get(`/user/api/comments/hasVoted`, {
            params: {
                comment_id: commentId,
            },
        });

        // 이미 투표한 상태
        if (voteCheckResponse.data.hasVoted) {
            // 현재 투표 상태와 반대 행동을 할 경우, 투표 상태를 업데이트
            if (voteCheckResponse.data.voteType !== voteType) {
                await axiosInstance.post(`/user/api/comments/updateVote`, {
                    comment_id: commentId,
                    like_count: voteType, // 새로운 투표 유형으로 업데이트
                });
            } else {
            }
        } else {
            // 처음 투표하는 경우
            await axiosInstance.post(`/user/api/comments/firstVote`, {
                comment_id: commentId,
                like_count: voteType === 1 ? 1 : -1, // 추천 또는 비추천에 따라 like_count 조정
            });
        }
        fetchComments(); // 댓글 목록을 새로고침
    };

    // 댓글 작성 제출 처리
    const handleSubmit = async (event) => {
        event.preventDefault();
        let reqBody = {
            post_id: postId,
            content: content,
        };
        await axiosInstance.post(`/user/api/community/posts/detail/comments`, reqBody);
        setContent('');
        fetchComments();
    };

    // 답글 입력 변경 처리
    const handleReplyChange = (commentId, value) => {
        setReplyContents(prev => ({ ...prev, [commentId]: value }));
    };

    const onReplySubmitted = (isCancelled = false) => {
        if (!isCancelled) {
            fetchComments(); // 댓글 목록을 새로고침
        }
        setActiveReplyId(null); // 대댓글 폼을 숨김
    };

    return (
        <div className="comment-section">
            <form onSubmit={handleSubmit} className="comment-form">
            <textarea
                className="comment-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="댓글을 입력하세요"
            />
                <button type="submit" className="comment-write-button">댓글 작성</button>
            </form>

            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.comment_id} className={`comment-item ${comment.parent_comment_id ? 'reply-item' : ''}`}>
                        <div className="comment-vote-area">
                            <button onClick={() => handleVote(comment.comment_id, 1)} className="vote-button">
                                <span className="vote-icon">👍</span> {/* 추천 아이콘 */}
                            </button>
                            <span>{comment.like_count}</span>
                            <button onClick={() => handleVote(comment.comment_id, -1)} className="vote-button">
                                <span className="vote-icon">👎</span> {/* 비추천 아이콘 */}
                            </button>
                            <p className="comment-content">{comment.user_id}: {comment.content}</p>
                            <button className="reply-button"
                                    onClick={() => setActiveReplyId(activeReplyId === comment.comment_id ? null : comment.comment_id)}>
                                답글 달기
                            </button>
                        </div>
                        {activeReplyId === comment.comment_id && (
                            <ReplyComment
                                postId={postId}
                                parentId={comment.comment_id}
                                parentUserId={comment.user_id}
                                replyContent={replyContents[comment.comment_id] || ''}
                                onReplyChange={(value) => handleReplyChange(comment.comment_id, value)}
                                onReplySubmitted={onReplySubmitted}
                            />
                        )}
                        {comment.replies && comment.replies.length > 0 && (
                            comment.replies.map((reply) => (
                                <div key={reply.comment_id} className="reply-item">
                                    <p className="comment-content">{reply.user_id}: {reply.content}</p>
                                    <button className="re-reply-button"
                                            onClick={() => setActiveReplyId(activeReplyId === reply.comment_id ? null : reply.comment_id)}>
                                        답글 달기
                                    </button>
                                    {activeReplyId === reply.comment_id && (
                                        <ReplyComment
                                            postId={postId}
                                            parentUserId={reply.user_id} // 부모 댓글의 user_id를 전달
                                            parentId={comment.top_level_parent_id} // 최상위 부모 ID를 사용
                                            replyContent={replyContents[reply.comment_id] || ''}
                                            onReplyChange={(value) => handleReplyChange(reply.comment_id, value)}
                                            onReplySubmitted={() => onReplySubmitted()}
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ))
            ) : (
                <p className="no-comments">댓글이 없습니다.</p>
            )}
        </div>
    );
};

export default Comment;
