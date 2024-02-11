import React, { useState, useEffect } from 'react';
import './CommunityMenu.css';
import axios from "axios";
import {Link} from "react-router-dom";

function CommunityMenu() {

    const [menuItems, setMenuItems] = useState({}); // 장르별로 게임을 분류하기 위한 객체

    useEffect(() => {
        fetchGameList();
    }, []);

    async function fetchGameList() {
        try {
            const response = await axios.get("/api/channel/GameList");
            const games = response.data.gameList;
            // 게임 리스트를 장르별로 분류
            const genreGroups = games.reduce((acc, game) => {
                const genre = game.code_desc; // 장르를 code_desc에서 직접 가져옴
                if (!acc[genre]) {
                    acc[genre] = [];
                }
                acc[genre].push(game);
                return acc;
            }, {});
            setMenuItems(genreGroups);
        } catch (error) {
            console.log("error : ", error);
        }
    };

    const renderMenu = () => {
        return Object.entries(menuItems).map(([genre, games]) => (
            <div key={genre} className="genre-section">
                <h3 className="genre-title">{genre}</h3>
                {games.map((game) => (
                    <div key={game.code} className="center-menu-item">
                        <Link style={{textDecoration:"none"}} to={`/community/${game.code}`}>
                            <span className="center-menu-eachTitle">{game.code_name_kor}</span>
                        </Link>
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div className="center-menu">
            {renderMenu()}
        </div>
    );
}

export default CommunityMenu;
