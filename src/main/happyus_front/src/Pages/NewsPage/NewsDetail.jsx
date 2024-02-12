import React, { useEffect, useState } from 'react';
import axiosInstance from "../../contexts/axiosInstance";
import { useParams } from 'react-router-dom';
import './NewsDetail.css';

function NewsDetail() {
    const [newsData, setNewsData] = useState(null);
    const { news_id } = useParams();

    useEffect(() => {
        const fetchNewsDetail = async () => {
            const response = await axiosInstance.get(`/api/news/detail?news_id=${news_id}`);
            if (response.status === 200) {
                setNewsData(response.data);
            }
        };
        fetchNewsDetail();
    }, [news_id]); // 의존성 배열에 news_id 추가

    // If the data is not yet loaded, display a loading message
    if (!newsData) return <div>Loading...</div>;

    return (
        <div id="news-detail-container">
            <h1 className="news-title">{newsData.news_title}</h1>
            <div className="news-content" dangerouslySetInnerHTML={{ __html: newsData.news_content }}></div>
            <a href={newsData.url} target="_blank" rel="noreferrer" className="read-more-link">기사 원문보기</a>
        </div>
    );
}

export default NewsDetail;
