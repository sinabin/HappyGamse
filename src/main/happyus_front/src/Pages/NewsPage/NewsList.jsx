import React, {useEffect, useState} from 'react';
import axiosInstance from "../../contexts/axiosInstance";
import { Link } from 'react-router-dom';
import Pagination from "../../Common/Pagination";
import './NewsList.css';
import {usePagination} from "../../hooks/usePagination";


function NewsList() {
    const [newsList, setNewsList] = useState([]); // 뉴스 Data

    // 페이징 관련
    const [totalCount, setTotalCount] = useState(0);// 총 뉴스 Data 건수
    const { page, setPage, buttonRange, PAGE_SIZE } = usePagination(totalCount); // 페이징 관련 custom hook 사용

    useEffect(() => {
        getNewsList();
    }, [page]);

    async function getNewsList() {
        const response = await axiosInstance.get('/api/news/list',
            {
                params: {
                    page: page,
                    size: PAGE_SIZE
                }
            });
        // API response의 Data가 undefined일 경우를 고려하여 논리연산자 사용
        setNewsList(response.data.newsList || []);
        setTotalCount(response.data.paging.total_count || 0);
    }

    return (
        <div id="news_page_container">
            <h1 id="news_page_header"> 게임 뉴스</h1>
            { newsList.map((news) => (
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
            )) }

            {/* 페이지네이션 */}
            <Pagination buttonRange={buttonRange} totalCount={totalCount} setPage={setPage} pageSize={PAGE_SIZE} />
        </div>
    );
}

export default NewsList;