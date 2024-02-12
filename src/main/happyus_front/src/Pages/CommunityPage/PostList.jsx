import React, {useEffect, useState} from 'react';
import axios from "axios";
import moment from 'moment';
import 'moment/locale/ko';
import {DataGrid} from '@mui/x-data-grid';
import './PostList.css';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom"; //  //Material UI의 sx prop은 스타일링을 위해 import
function PostList({ gameCode, gameName, boardCategory, categoryName }) {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 생성

    console.log("PostList 컴포넌트 - boardCategory :", boardCategory)
    useEffect(() => {
        fetchPosts();
    }, [gameCode, boardCategory, categoryName]);

    async function fetchPosts() {
        let reqBody = {
            community_div: gameCode,
            post_category: boardCategory,
        }
        try {
            const response = await axios.post("/api/community/posts", reqBody);
            // 데이터를 DataGrid 포맷에 맞게 변환
            const formattedPosts = response.data.posts ? response.data.posts.map((post, index) => ({
                id: index, // DataGrid에서 요구하는 고유 id
                like_count: post.like_count + ' 🔼',
                post_title: post.post_title,
                reg_date: moment(post.reg_date).fromNow(),
                user_id: post.user_id,
                post_id: post.post_id,
            })) : [];
            setPosts(formattedPosts);
        } catch (error) {
            console.log("error : ", error);
        }
    }

    // DataGrid 컬럼 정의
    let columns = [
        { field: 'like_count', headerName: '🔼', width: 90 },
        { field: 'post_title', headerName: '제목', width: 150, flex: 1 }, // flex 속성 추가
        { field: 'reg_date', headerName: '등록 시간', width: 110 },
        { field: 'user_id', headerName: '사용자 ID', width: 110 },
    ];

    return (
        <div>
            <div id="board-title">
                {gameName +"　　📝"+ categoryName} 게시판📝
            </div>
            <Box sx={{
                overflowY: 'auto', // 스크롤바 추가
                height: {xs: '50vh', sm: '60vh', md: '85vh'},
                width: {xs: '100%', sm: '50vw', md: '40vw'},
                '& .MuiDataGrid-root': {
                    backgroundColor: '#16213E',
                },
                '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #ffffff',
                    color: '#ffffff'
                },
                '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#0f3460',
                },
                '& .MuiDataGrid-footerContainer': {
                    color: '#ffffff', // footer 글자색을 흰색으로 설정
                },
                '& .MuiTablePagination-root': {
                    color: '#ffffff', // 페이징 관련 텍스트 색상을 흰색으로 설정
                },
                '& .MuiButtonBase-root': {
                    color: '#ffffff', // 모든 버튼 기반의 색상을 흰색으로 설정
                },
                '& .MuiIconButton-root': {
                    color: '#ffffff', // 아이콘 버튼의 색상을 흰색으로 설정
                },
                '& .MuiSvgIcon-root': {
                    color: '#ffffff', // SVG 아이콘의 색상을 흰색으로 설정
                },
            }}>
                <DataGrid rows={posts} columns={columns} className="hide-header"
                          localeText={{noRowsLabel: '작성된 게시글이 없습니다.'}}
                          initialState={{
                              pagination: {paginationModel: {pageSize: 15}},
                          }}
                          pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
                          disableSelectionOnClick
                          autoHeight
                          onRowClick={(params) => {navigate(`/community/${gameCode}/posts/detail/${params.row.post_id}`);}}
                />
            </Box>
        </div>
    );
}

export default PostList;
