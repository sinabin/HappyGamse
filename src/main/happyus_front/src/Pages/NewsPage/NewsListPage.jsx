import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import Pagination from "../../Components/Pagination";
import './NewsListPage.css';
import {usePagination} from "../../hooks/usePagination";


function NewsListPage() {
    const [newsList, setNewsList] = useState([]); // 뉴스 Data

    // 페이징 관련
    const [totalCount, setTotalCount] = useState(0);// 총 뉴스 Data 건수
    const { page, setPage, buttonRange, PAGE_SIZE } = usePagination(totalCount); // 페이징 관련 custom hook 사용

    useEffect(() => {
        getNewsList();
    }, [page]);

    async function getNewsList() {
        try {
            const response = await axios.get('/api/news/list',
                {
                    params: {
                            page: page,
                            size: PAGE_SIZE
                    }
                });
            if (response.status === 200) {
                setNewsList(response.data.newsList);
                setTotalCount(response.data.paging.total_count);
            }
        } catch (error) {
            console.error('Failed to fetch news list:', error);
        }
    }


    return (
        <div id="news_page_container">
            <h1 id="news_page_header"> 게임 뉴스 요약</h1>
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

export default NewsListPage;