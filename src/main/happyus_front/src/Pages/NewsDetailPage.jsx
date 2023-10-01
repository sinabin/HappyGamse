import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';

function NewsDetailPage() {
    const [newsData, setNewsData] = useState(null);
    const { news_id } = useParams();

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const response = await axios.get(`/api/news/detail?news_id=${news_id}`);
                if (response.status === 200) {
                    setNewsData(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch news detail:', error);
            }
        };

        fetchNewsDetail();
    }, [news_id]); // 의존성 배열에 news_id 추가

    console.log("news data : ", newsData);
    // If the data is not yet loaded, display a loading message
    if (!newsData) return <div>Loading...</div>;

    return (
        <div style={{
            backgroundColor: "#333",
            padding: "20px",
            fontFamily: "'Arial', sans-serif",
            maxWidth: "800px",
            margin: "0 auto"
        }}>
            <h1 style={{
                color: "white",
                borderBottom: "solid 3px #808000",
                textAlign: "center",
                padding: "20px",
                fontSize:'2em',
                fontWeight:"bold",
                textShadow:'2px 2px 4px #000000',
            }}>{newsData.news_title}</h1>

            <div style={{color:"white"}} dangerouslySetInnerHTML={{ __html: newsData.news_content }}></div>

            <a href={newsData.url} target="_blank" rel="noreferrer" style={{color:"white"}}>Read more</a>
        </div>
    );
}

export default NewsDetailPage;
