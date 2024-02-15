// ReplyComment.js
import React, { useState } from 'react';
import './Comment.css';
import axiosInstance from "../../contexts/axiosInstance";

const ReplyComment = ({ postId, parentId, parentUserId, onReplySubmitted }) => {
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = async (event) => {
        event.preventDefault();
        // 대댓글 내용에 부모 댓글의 사용자 ID를 태깅
        const contentWithMention = `@${parentUserId} ${replyContent}`;

        let reqBody = {
            post_id: postId,
            parent_comment_id: parentId,
            content: contentWithMention,
        };

        await axiosInstance.post(`/user/api/community/posts/detail/comments`, reqBody);
        setReplyContent('');
        onReplySubmitted(); // 부모 컴포넌트에서 상태 업데이트를 위한 콜백 호출
    };

    return (
        <div className="reply-container">
            <form onSubmit={handleReplySubmit} className="reply-form">
        <textarea className="reply-textarea" value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="대댓글을 입력하세요"/>
                <div className="reply-button-container">
                    <button type="submit" className="reply-submit-button">답글 작성</button>
                    <button type="button" className="reply-cancel-button" onClick={() => onReplySubmitted(true)}>취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReplyComment;
