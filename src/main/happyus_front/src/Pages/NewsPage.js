import React, {useEffect, useState} from 'react';

function NewsPage() {
    const [newsList, setNewsList] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        console.log("dd")
    }, [page]);

    return (
        <div style={{
            backgroundColor: "#333",
            padding: "20px",
            fontFamily: "'Arial', sans-serif",
            maxWidth: "600px",
            margin: "0 auto"
        }}>
            <h1 style={{
                color: "white",
                borderBottom: "solid 3px #808000",
                textAlign: "center",
                padding: "20px",
                fontSize: window.innerWidth <= 768 ? '1.5em' : '2em',
                fontWeight: "bold",
                textShadow: '2px 2px 4px #000000',
            }}> Game News</h1>

            {newsList.map((news) => (
                <div key={news.id} style={{
                    backgroundColor: "#666",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px",
                    display: 'flex',
                    flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
                }}>
                    <img src={news.imgLocation} alt="News" style={{
                        width: window.innerWidth <= 768 ? '100%' : "200px",
                        height: "auto",
                        marginRight: window.innerWidth <= 768 ? '0' : "20px",
                        marginBottom: window.innerWidth <= 768 ? '20px' : "0"
                    }}/>
                    <div>
                        <a style={{textDecoration:"none"}} href={`/news/news_id=${news.id}`}>  <h2 style={{color: "white", fontWeight: "bold"}}>{news.title}</h2></a>
                        <a style={{textDecoration:"none"}} href={`/news/news_id=${news.id}`}> <p style={{color: "white"}}>{news.summary}</p> </a>
                    </div>
                </div>
            ))}

            {page > 1 &&
                <button onClick={() => setPage(page - 1)}>이전 페이지</button>}
            {newsList.length === 10 &&
                <button onClick={() => setPage(page + 1)}>다음 페이지</button>}
        </div>
    );
}

export default NewsPage;