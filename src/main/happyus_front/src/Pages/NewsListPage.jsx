import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import Pagination from "../Components/Pagination";
import './NewsListPage.css';


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

            {/* 페이지네이션 버튼 */}
            <Pagination buttonRange={buttonRange} totalCount={totalCount} setPage={setPage}/>
        </div>
    );
}

export default NewsListPage;