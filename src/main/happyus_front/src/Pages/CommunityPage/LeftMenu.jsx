import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";

function LeftMenu({ handleMenuClick}) {
    const { gameCode } = useParams(); // URL에서 gameCode 추출
    const [leftMenu, setLeftMenu] = useState([]); // LeftMenu Data State 관리

    useEffect(() => {
        const fetchLeftMenu = async () => {
            try {
                const response = await axios.get("/api/community/leftMenu");
                setLeftMenu(response.data.leftMenu); // 메뉴 데이터로 상태를 업데이트
            } catch (error) {
                console.log("Left menu loading error: ", error);
            }
        };
        fetchLeftMenu();
    }, []);


    return (
        <div className="left-side-menu">
            {leftMenu.map((menu) => (
                <div key={menu.code} className="left-menu-item" onClick={() => handleMenuClick(menu.code, menu.code_name_kor)}>
                    <span className="left-menu-eachTitle">{menu.code_name_kor}</span>
                </div>
            ))}
        </div>
    );
}

export default LeftMenu;
