import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import BoardArea from './BoardArea'; // BoardArea 컴포넌트 임포트
import './CommunityMain.css';

function CommunityMain() {
    const {gameCode } = useParams();
    const [leftMenu, setLeftMenu] = useState([]);
    const [boardCategory, setBoardCategory] = useState("");
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        fetchLeftMenu();
    }, []);

    useEffect(() => {
        if (leftMenu.length > 0 && boardCategory === "") {
            handleMenuClick(leftMenu[0].code, leftMenu[0].code_name_kor);
        }
    }, [leftMenu]);
    async function fetchLeftMenu() {
        try {
            const response = await axios.get("/api/community/leftMenu");
            setLeftMenu(response.data.leftMenu);
        } catch (error) {
            console.log("error : ", error);
        }
    };

    const handleMenuClick = (code, codeName) => {
        setBoardCategory(code);
        setCategoryName(codeName);
    }

    return (
        <div>
            <div className="community-container">
                {/* LeftMenu Area - 서버로부터 응답은 leftMenu 배열 Data로 LeftSide에 메뉴를 렌더링 */}
                <div className="left-side-menu">
                    {leftMenu.map((leftMenu) => (
                        <Link key={leftMenu.code} style={{textDecoration: "none"}} to={`/community/${gameCode}`}
                              onClick={() => handleMenuClick(leftMenu.code, leftMenu.code_name_kor)}>
                            <div className="left-menu-item">
                                <span className="left-menu-eachTitle">{leftMenu.code_name_kor}</span>
                            </div>
                        </Link>
                    ))}
                </div>
                {/* Board Area - BoardArea 컴포넌트를 사용하여 게시판 영역 렌더링 */}
                <div className="board-area-container">
                    <BoardArea gameCode={gameCode} boardCategory={boardCategory} categoryName={categoryName}/>
                </div>
            </div>
        </div>
    );
}

export default CommunityMain;
