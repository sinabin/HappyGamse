import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import Pagination from "../Components/Pagination";


const PAGE_SIZE = 10;
const DEFAULT_BUTTON_RANGE = [1, 10];

function NewsListPage() {
    const [newsList, setNewsList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [buttonRange, setButtonRange] = useState(DEFAULT_BUTTON_RANGE);

    useEffect(() => {
        fetchNewsList();
        updateButtonRange();
    }, [page]);

    async function fetchNewsList() {
        try {
            const response = await axios.get('/api/news/list', { params: { page: page, size: PAGE_SIZE } });
            if (response.status === 200) {
                setNewsList(response.data.newsList);
                setTotalCount(response.data.paging.total_count);
            }
        } catch (error) {
            console.error('Failed to fetch news list:', error);
        }
    }

    function updateButtonRange() {
        if (page < buttonRange[0] || page > buttonRange[1]) {
            let newStartPage = Math.floor((page - 1) / PAGE_SIZE) * PAGE_SIZE + 1;
            let newEndPage = newStartPage + PAGE_SIZE - 1;

            if (newEndPage > Math.ceil(totalCount / PAGE_SIZE))
                newEndPage = Math.ceil(totalCount / PAGE_SIZE);

            setButtonRange([newStartPage,newEndPage]);
        }
    }

    return (
        <div style={{
            backgroundColor: "#333",
            padding: "20px",
            fontFamily: "'Arial', sans-serif",
            maxWidth: "800px", // 컨테이너의 최대 너비를 증가
            margin: "0 auto"
        }}>
            <h1 style={{
                color: "white",
                borderBottom: "solid 3px #808000",
                textAlign: "center",
                padding: "20px",
                fontSize: '2em',
                fontWeight: "bold",
                textShadow: '2px 2px 4px #000000',
            }}> Game News</h1>

            {newsList.map((news) => (
                <div key={news.news_id} style={{
                    backgroundColor: "#666",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px",
                    display: 'flex',
                    alignItems: 'center' // 중앙 정렬 추가
                }}>
                    <img src={`/imgs/news/${news.news_id}.jpg`} alt="News"
                         style={{width: "200px", height: "auto", marginRight: "20px"}}/>
                    <div>
                        <Link to={`/news/detail/${news.news_id}`} style={{textDecoration:"none"}}>
                            <h2 style={{color:"white", fontWeight:"bold"}}>{news.news_title}</h2>
                        </Link>
                        <Link to={`/news/detail/${news.news_id}`} style={{textDecoration:"none"}}>
                            <p style={{color:"white"}}>{news.news_desc}</p>
                        </Link>
                    </div>
                </div>
            ))}

            {/* 페이지네이션 버튼 */}
            <Pagination
                buttonRange={buttonRange}
                totalCount={totalCount}
                setPage={setPage}
            />

        </div>
    );
}

export default NewsListPage;