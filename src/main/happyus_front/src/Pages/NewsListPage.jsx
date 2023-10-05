import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import Pagination from "../Components/Pagination";
import './NewsListPage.css';


const PAGE_SIZE = 10; // 페이지당 보여줄 item 개수
const BUTTON_COUNT = 5 // 페이지당 생성할 버튼 개수
const DEFAULT_BUTTON_RANGE = [1, 5]; // 페이징 번호 버튼 범위

function NewsListPage() {
    const [newsList, setNewsList] = useState([]); // 뉴스 Data
    const [page, setPage] = useState(1); // 현재 페이지
    const [totalCount, setTotalCount] = useState(0);// 총 뉴스 Data 건수
    const [buttonRange, setButtonRange] = useState(DEFAULT_BUTTON_RANGE); // 생성할 버튼 범위

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
            let newStartPage = Math.floor((page - 1) / DEFAULT_BUTTON_RANGE[1]) * DEFAULT_BUTTON_RANGE[1] + 1;
            let newEndPage = newStartPage + DEFAULT_BUTTON_RANGE[1] - 1;

            if (newEndPage > Math.ceil(totalCount / DEFAULT_BUTTON_RANGE[1]))
                newEndPage = Math.ceil(totalCount / DEFAULT_BUTTON_RANGE[1]);

            setButtonRange([newStartPage,newEndPage]);
        }
    }

    return (
        <div id="news_page_container">
            <h1 id="news_page_header"> 게임 뉴스 요약</h1>

            {newsList.map((news) => (
                <div key={news.news_id} className="news-card">
                    <Link to={`/news/detail/${news.news_id}`} className="news-link">
                        <img src={`/imgs/news/${news.news_id}.jpg`} alt="News" className="news-image"/>
                    </Link>
                    <div className="news-list-content">
                        <Link to={`/news/detail/${news.news_id}`} className="news-link">
                            <h4 className="news-list-title">{ news.news_title }</h4>
                        </Link>
                        <p className="news-desc">{ news.news_desc }</p>
                    </div>
                </div>
            ))}

            {/* 페이지네이션 */}
            <Pagination buttonRange={buttonRange} totalCount={totalCount} setPage={setPage} pageSize={PAGE_SIZE} />
        </div>
    );
}

export default NewsListPage;