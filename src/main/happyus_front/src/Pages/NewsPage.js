// NewsPage.js
import React, { useEffect, useState } from 'react';

function NewsPage() {
    const [newsList, setNewsList] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetch(`/api/news?page=${page}`)
            .then(response => response.json())
            .then(data => setNewsList(data));
    }, [page]);

    return (
        <div>
            <span>뉴스 페이지</span>
{/*            {newsList.map((news) => (
                <div key={news.id}>
                    <h2>{news.title}</h2>
                    <p>{news.summary}</p>
                </div>
            ))}*/}

            {page > 1 &&
                <button onClick={() => setPage(page - 1)}>이전 페이지</button>}
            {newsList.length === 10 &&
                <button onClick={() => setPage(page + 1)}>다음 페이지</button>}
        </div>
    );
}

export default NewsPage;