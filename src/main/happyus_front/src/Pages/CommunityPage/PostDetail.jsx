import React, {useEffect, useState} from 'react';
import axios from "axios";
import DOMPurify from 'dompurify';
import 'moment/locale/ko';
import './PostDetail.css';
import {useNavigate, useParams} from "react-router-dom";
import LeftMenu from './LeftMenu';
import Comment from "./Comment";

function PostDetail() {
    const { post_id, gameCode } = useParams();
    const navigate = useNavigate();

    const [postDetail, setPostDetail] = useState({});

    useEffect(() => {
        console.log("post_id : ", post_id);
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

    const [boardCategory, setBoardCategory] = useState( "");
    const [categoryName, setCategoryName] = useState("");


    // handleMenuClick 함수 내에서 navigate를 사용합니다.
    const handleMenuClick = (code, codeName) => {
        setBoardCategory(code);
        setCategoryName(codeName);
        navigate(`/community/${gameCode}/${code}`, {state : {menuName : codeName }}); // 선택된 카테고리로 URL을 업데이트하여 상태를 명시적으로 관리
    };

    return (
        <div className="community-container">
            <LeftMenu handleMenuClick={handleMenuClick} />
            <div className="board-area-container">
                <div className="post-header">
                    <h1>{postDetail.post_title}</h1>
                </div>
                <div className="post-body">
                    <article id="post-context" dangerouslySetInnerHTML={{ __html: postDetail.post_content || '' }}></article>
                    <Comment postId={post_id}></Comment>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
