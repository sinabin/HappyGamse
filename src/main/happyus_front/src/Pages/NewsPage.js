import React, {useEffect, useState} from 'react';

function NewsPage() {
    const [newsList, setNewsList] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setNewsList([{
            id: "1",
            title: "퍼스트 디센던트, 콘솔과 PC에서 공개 테스트 시작",
            imgLocation: "/imgs/news/test1.jpg",
            summary: "넥슨은 19일 16시(한국시간)부터 루트슈터 신작 ‘퍼스트 디센던트(The First Descendant)’의 크로스플레이 공개 테스트를 시작한다. 테스트는 26일까지 진행되며, PC(스팀), Xbox One, Xbox 시리즈..."
        }, {
            id: "2",
            title: "P의 거짓, 잔혹동화와 강렬한 액션 담긴 런칭 트레일러 공개",
            imgLocation: "/imgs/news/test2.jpg",
            summary: "네오위즈는 19일, 산하 스튜디오 라운드8의 소울라이크 신작 P의 거짓(Lies of P) 출시에 맞춰 런칭 트레일러를 공개했다. P의 거짓 공식 유튜브 채널을 통해 공개된 런칭..."
        },{
            id: "3",
            title: "P의 거짓, 잔혹동화와 강렬한 액션 담긴 런칭 트레일러 공개",
            imgLocation: "/imgs/news/test2.jpg",
            summary: "네오위즈는 19일, 산하 스튜디오 라운드8의 소울라이크 신작 P의 거짓(Lies of P) 출시에 맞춰 런칭 트레일러를 공개했다. P의 거짓 공식 유튜브 채널을 통해 공개된 런칭..."
        },{
            id: "4",
            title: "P의 거짓, 잔혹동화와 강렬한 액션 담긴 런칭 트레일러 공개",
            imgLocation: "/imgs/news/test2.jpg",
            summary: "네오위즈는 19일, 산하 스튜디오 라운드8의 소울라이크 신작 P의 거짓(Lies of P) 출시에 맞춰 런칭 트레일러를 공개했다. P의 거짓 공식 유튜브 채널을 통해 공개된 런칭..."
        },{
            id: "5",
            title: "P의 거짓, 잔혹동화와 강렬한 액션 담긴 런칭 트레일러 공개",
            imgLocation: "/imgs/news/test2.jpg",
            summary: "네오위즈는 19일, 산하 스튜디오 라운드8의 소울라이크 신작 P의 거짓(Lies of P) 출시에 맞춰 런칭 트레일러를 공개했다. P의 거짓 공식 유튜브 채널을 통해 공개된 런칭..."
        },{
            id: "6",
            title: "P의 거짓, 잔혹동화와 강렬한 액션 담긴 런칭 트레일러 공개",
            imgLocation: "/imgs/news/test2.jpg",
            summary: "네오위즈는 19일, 산하 스튜디오 라운드8의 소울라이크 신작 P의 거짓(Lies of P) 출시에 맞춰 런칭 트레일러를 공개했다. P의 거짓 공식 유튜브 채널을 통해 공개된 런칭..."
        }])
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
                        <h2 style={{color: "white", fontWeight: "bold"}}>{news.title}</h2>
                        <p style={{color: "white"}}>{news.summary}</p>
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