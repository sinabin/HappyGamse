import React, {useEffect, useState} from 'react';
import axios from "axios";
import DOMPurify from 'dompurify';
import 'moment/locale/ko';
import './PostDetail.css';
import {useNavigate, useParams} from "react-router-dom";
import LeftMenu from './LeftMenu';
import Comment from "./Comment";
import PostList from "./PostList";
import {useAuthentication} from "../../contexts/AuthenticationContext";
import moment from "moment/moment";
import useStore from "../../contexts/store";

function PostDetail() {
    const { post_id, gameCode } = useParams();
    const navigate = useNavigate();
    const isLogined = useAuthentication(); // 로그인 정보
    const [postDetail, setPostDetail] = useState({});

    useEffect(() => {
        fetchPostDetail(post_id);
    }, [post_id]);

    async function fetchPostDetail(post_id) {
        const response = await axios.get("/api/community/posts/detail",
            {
                params: {
                    post_id: post_id,
                }
            });
        const cleanContent = DOMPurify.sanitize(response.data.postDetail.post_content);
        setPostDetail({...response.data.postDetail, post_content: cleanContent});
    }

    // Zustand 스토어에서 상태와 업데이트 함수들을 가져옴
    const { setGameCode, setGameName, setBoardCategory, setCategoryName, boardCategory, categoryName } = useStore();


    // handleMenuClick 함수 내에서 navigate를 사용
    const handleMenuClick = (code, codeName) => {
        setBoardCategory(code);
        setCategoryName(codeName);
        navigate(`/community/${gameCode}/${code}`, {state : {menuName : codeName }}); // 선택된 카테고리로 URL을 업데이트하여 상태를 명시적으로 관리
    };

    const handleEditPost = () => {
        navigate(`/user/community/${gameCode}/posts/edit-post/${post_id}`);
    };

    const handleDeletePost = async () => {
        if(window.confirm('글을 삭제하시겠습니까?')) {
            const response = await axios.delete(`/api/community/posts/delete`, {
                data: {
                    post_id: post_id, // 이 부분은 사실상 URL에 이미 포함되어 있어 필요 없을 수 있습니다.
                    user_id: isLogined.user_id
                }
            });
            if(response.data.result) {
                navigate(`/community/${gameCode}`);
            } else {
                alert('게시글 삭제에 실패하였습니다.');
            }
        }
    };


    return (
        <div className="community-container">
            <LeftMenu handleMenuClick={handleMenuClick} />
            <div className="board-area-container">
                <div className="post-header">
                    <h1>{postDetail.post_title}</h1>
                    <div className="post-title-container">
                        <div className="title-info-item">
                            <span>{moment(postDetail.reg_date).fromNow()} &nbsp;</span>
                            <span>{postDetail.user_id}</span>
                        </div>
                        <div className="title-info-item2">
                            <span>조회수 {postDetail.view_count} &nbsp; &nbsp;</span>
                            <span>추천 {postDetail.like_count}</span>
                        </div>
                    </div>
                    {isLogined.user_id === postDetail.user_id && (
                        <div className="post-button-container">
                            <button className="edit-button" onClick={handleEditPost}>수정</button>
                            <button className="delete-button" onClick={handleDeletePost}>삭제</button>
                        </div>
                    )}
                </div>
                <div className="post-body">
                    <article id="post-context" dangerouslySetInnerHTML={{ __html: postDetail.post_content || '' }}></article>
                    <Comment postId={post_id}></Comment>
                </div>
                <div>
                    <PostList/>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
