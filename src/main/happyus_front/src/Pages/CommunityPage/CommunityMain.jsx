import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PostList from './PostList';
import './CommunityMain.css';
import LeftMenu from "./LeftMenu";
import useStore from '../../contexts/store';

function CommunityMain() {
    const { gameCode, categoryCode } = useParams();
    const location = useLocation();
    let { menuName: codeName } = location.state || {};
    const navigate = useNavigate();


    // localStorage에서 게임 이름 가져오기
    const gameName = localStorage.getItem('gameName') || '';
    // Zustand 스토어에서 상태와 업데이트 함수들을 가져옴
    const { setGameCode, setGameName, setBoardCategory, setCategoryName, boardCategory, categoryName } = useStore();

    useEffect(() => {
        if (gameCode) setGameCode(gameCode);
        if (categoryCode) setBoardCategory(categoryCode);
        if (codeName) setCategoryName(codeName);
        setGameName(gameName);
    }, [gameCode, categoryCode, codeName, setGameCode, setGameName, setBoardCategory, setCategoryName]);

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
                    <div id="board-title">{`${gameName} 📝 ${categoryName} 게시판`}</div>
                    <PostList/>
                </div>
            </div>
        </div>
    );
}

export default CommunityMain;
