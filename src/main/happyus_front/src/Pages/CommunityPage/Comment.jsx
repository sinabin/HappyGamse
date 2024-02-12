import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Comment.css'
const Comment = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/community/posts/detail/comments?post_id=${postId}`);
            // 서버로부터 받은 데이터를 배열로 변환
            const commentsArray = Array.isArray(response.data.comments)
                ? response.data.comments
                : [response.data.comments];
            setComments(commentsArray);
        } catch (error) {
            console.error('댓글을 불러오는 데 실패했습니다.', error);
        }
    };

    const handleVote = async (commentId, type) => {
        try {
            await axios.post(`/api/comments/vote`, { commentId, type });
            fetchComments();
        } catch (error) {
            console.error('투표에 실패했습니다.', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let reqBody = {
            post_id : postId, // 주의: 서버측에서 요구하는 필드명과 일치해야 합니다. CommentDTO 구조를 확인하세요.
            content : content,
        };
        try {
            // 경로 수정: 댓글 생성 API 경로에 맞게 변경
            await axios.post(`/user/api/community/posts/detail/comments`, reqBody);
            setContent('');
            fetchComments();
        } catch (error) {
            console.error('댓글 작성에 실패했습니다.', error);
        }
    };



    return (
        <div className="comment-section">
            <form onSubmit={handleSubmit} className="comment-form">
                <textarea className="comment-textarea" value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="댓글을 입력하세요"/>
                <button type="submit" className="comment-write-button">댓글 작성</button>
            </form>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className={`comment-item ${comment.parent_comment_id ? 'reply-item' : ''}`}>
                        <div className="comment-vote-area">
                            <button onClick={() => handleVote(comment.id, 'upvote')} className="vote-button">
                                <span className="vote-icon">👍</span> {/* 추천 아이콘 */}
                            </button>
                            <span>{comment.like_count}</span>
                            <button onClick={() => handleVote(comment.id, 'downvote')} className="vote-button">
                                <span className="vote-icon">👎</span> {/* 비추천 아이콘 */}
                            </button>
                        </div>
                        <p className="comment-content">{comment.user_id}: {comment.content}</p>
                    </div>
                ))
            ) : (
                <p>댓글이 없습니다.</p>
            )}
        </div>
    );
};

export default Comment;
