import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PostList from './PostList';
import './CommunityMain.css';
import LeftMenu from "./LeftMenu";

function CommunityMain() {
    const { gameCode, categoryCode } = useParams();
    const location = useLocation();
    let { menuName: codeName } = location.state || {};
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 초기화합니다.

    let gameName = localStorage.getItem("gameName");
    const [boardCategory, setBoardCategory] = useState(categoryCode || "LM1001");
    const [categoryName, setCategoryName] = useState(codeName || "자유");


    // handleMenuClick 함수 내에서 navigate를 사용합니다.
    const handleMenuClick = (code, codeName) => {
        setBoardCategory(code);
        setCategoryName(codeName);
        navigate(`/community/${gameCode}/${code}`); // 선택된 카테고리로 URL을 업데이트하여 상태를 명시적으로 관리
    };


    return (
        <div>
            <div className="community-container">
                {/* LeftMenu 컴포넌트를 사용하고 handleMenuClick 함수를 prop으로 전달 */}
                <LeftMenu handleMenuClick={handleMenuClick}/>
                {/* 게시판 영역 */}
                <div className="board-area-container">
                    {/* 조건부 로직을 적용하여 categoryCode 또는 boardCategory를 전달 */}
                    <PostList
                        gameCode={gameCode}
                        gameName={gameName}
                        boardCategory={boardCategory}
                        categoryName={categoryName}
                    />
                </div>
            </div>
        </div>
    );
}

export default CommunityMain;
