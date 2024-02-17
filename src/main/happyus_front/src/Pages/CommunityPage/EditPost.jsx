import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPost.css';
import DOMPurify from "dompurify";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 에디터의 스타일

function EditPost() {
    const { post_id, gameCode } = useParams();
    const navigate = useNavigate();
    const [postDetail, setPostDetail] = useState({});


    useEffect(() => {
        // 게시글의 현재 내용을 불러옵니다.
        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(`/api/community/posts/detail?post_id=${post_id}`);
                const cleanContent = DOMPurify.sanitize(response.data.postDetail.post_content);
                setPostDetail({...response.data.postDetail, post_content: cleanContent});
            } catch (error) {
                alert("게시글을 불러오는 도중 문제가 발생하였습니다. 관리자에게 문의해주세요.")
                navigate(`/community/${gameCode}/posts/detail/${post_id}`);
            }
        };

        fetchPostDetail();
    }, [post_id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPostDetail(prevState => ({ ...prevState, [name]: value }));
    };

    const handleQuillChange = (content) => {
        setPostDetail(prevState => ({ ...prevState, post_content: content }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`/user/api/community/posts/update`, postDetail);
        navigate(`/community/${gameCode}/posts/detail/${post_id}`); // 수정 후 해당 게시글 상세 페이지로
    };

    return (
        <div className="edit-post-container" style={{marginTop:"10px;"}}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input style={{backgroundColor:"#121212", color:"#FFFFFF"}}
                        type="text"
                        id="post_title"
                        name="post_title"
                        value={postDetail.post_title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="post_content" style={{color:"white"}}>내용</label>
                    <ReactQuill style={{marginTop:"20px;"}}
                        theme="snow"
                        value={postDetail.post_content}
                        onChange={handleQuillChange} />
                </div>
                <div className="editPostBtn-container">
                    <button className="edit-button" type="submit">수정 제출</button>
                    <button className="delete-button" type="button" onClick={ () => navigate(`/community/${gameCode}/posts/detail/${post_id}`)}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default EditPost;
