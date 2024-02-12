import React, {useEffect, useState} from 'react';
import './Comment.css'
import axiosInstance from "../../contexts/axiosInstance";

const Comment = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        // 전체 URL을 명시적으로 지정합니다.
        const response = await axiosInstance.get(`/api/community/posts/detail/comments?post_id=${postId}`);
        setComments(response.data.comments);
    };

    const handleVote = async (commentId, type) => {
        await axiosInstance.post(`/api/comments/vote`, {commentId, type});
        fetchComments();
    };

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
