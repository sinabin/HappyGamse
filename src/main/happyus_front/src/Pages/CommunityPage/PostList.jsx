import React, {useEffect, useState} from 'react';
import axios from "axios";
import moment from 'moment';
import 'moment/locale/ko';
import {DataGrid} from '@mui/x-data-grid';
import './PostList.css';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom"; //  //Material UI의 sx prop은 스타일링을 위해 import
import useStore from '../../contexts/store';
function PostList() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 생성
    const { gameCode, boardCategory, categoryName } = useStore();

    useEffect(() => {
        const fetchPosts = async () => {
            const reqBody = {
                community_div: gameCode,
                post_category: boardCategory,
            };
            const response = await axios.post('/api/community/posts', reqBody);
            const formattedPosts = response.data.posts ? response.data.posts.map((post, index) => ({
                id: index,
                like_count: `${post.like_count} 🔼`,
                post_title: post.post_title,
                reg_date: moment(post.reg_date).fromNow(),
                user_id: post.user_id,
                post_id: post.post_id,
            })) : [];
            setPosts(formattedPosts);
        };
        fetchPosts();
    }, [gameCode, boardCategory, categoryName]);

    // DataGrid 컬럼 정의
    const columns = [
        { field: 'like_count', headerName: '🔼', width: 90 },
        { field: 'post_title', headerName: '제목', width: 150, flex: 1 },
        { field: 'reg_date', headerName: '등록 시간', width: 110 },
        { field: 'user_id', headerName: '사용자 ID', width: 110 },
    ];

    // DataGrid 스타일 정의
    const dataGridSx = {
        height: { xs: '50vh', sm: '60vh', md: '85vh' },
        width: '100%',
        '& .MuiDataGrid-root': { backgroundColor: '#16213E' },
        '& .MuiDataGrid-cell': { borderBottom: '1px solid #ffffff', color: '#ffffff' },
        '& .MuiDataGrid-columnHeader': { backgroundColor: '#0f3460' },
        '& .MuiDataGrid-footerContainer': { color: '#ffffff' },
        '& .MuiButtonBase-root': { color: '#ffffff' },
        '& .MuiIconButton-root': { color: '#ffffff' },
        '& .MuiSvgIcon-root': { color: '#ffffff' },
    };

    return (
        <div className="postListArea">
            <Box sx={dataGridSx}>
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
