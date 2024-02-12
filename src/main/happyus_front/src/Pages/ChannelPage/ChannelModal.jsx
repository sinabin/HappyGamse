import React, {useContext, useEffect, useState} from "react";
import axiosInstance from "../../contexts/axiosInstance";
import {useNavigate} from 'react-router-dom';
import {ChannelContext} from "../../contexts/ChannelContext";
import Modal from "../../Components/Modal";

function ChannelModal({ showModal, toggleModal }) {

    const navigate = useNavigate();

    const [channelData, setChannelData] = useState({
        c_title: '',
        c_desc: '',
        c_type: 'open',
        c_subject: '',
        c_maxUser: 0,
        c_password:''
    });

    const { setSelectedChannel } = useContext(ChannelContext); // 선택한 채널명 상태값을 전역으로 관리
    const [gameList, setGameList] = useState([]);

    useEffect(() => {
        const fetchGameList = async () => {
            try {
                const response = await axiosInstance.get("/api/channel/GameList");
                setGameList(response.data.gameList);
            } catch (error) {
                console.error("게임 리스트를 불러오는 중 오류가 발생했습니다.", error);
            }
        };
        fetchGameList();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChannelData(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/channel/create', channelData);
            alert(response.data.message);
            setSelectedChannel(channelData.c_title);
            navigate(`/user/friend/channel/${response.data.c_id}`);
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("채널 생성 중 오류가 발생했습니다.");
            }
            console.error('채널 생성 중 오류가 발생했습니다.', error);
        }
    };


    return (
        <Modal show={showModal} title="채널 생성하기" onClose={toggleModal}>
            <form onSubmit={handleSubmit}>
                <label>
                    채널명
                    <input type="text" placeholder="채널명" name="c_title" value={channelData.c_title} onChange={handleChange} required />
                </label>
                <label>
                    채널 소개
                    <input type="text" placeholder="채널 소개" name="c_desc" value={channelData.c_desc} onChange={handleChange} required />
                </label>
                <label>
                    채널 타입
                    <select name="c_type" value={channelData.c_type} onChange={handleChange} required>
                        <option value="open">Open</option>
                        <option value="private">Private</option>
                    </select>
                </label>
                {channelData.c_type === 'private' && ( // 채널 타입이 'private'일 때만 비밀번호 입력 필드 표시
                    <label>
                        비밀번호
                        <input type="password" placeholder="비밀번호" name="c_password" value={channelData.c_password} onChange={handleChange} required />
                    </label>
                )}
                <label>
                    채널 주제
                    <select name="c_subject" value={channelData.c_subject} onChange={handleChange} required>
                        {gameList && gameList.map((game, index) => (
                            <option key={index} value={game.code_name_kor}>{game.code_name_kor}</option>
                        ))}
                    </select>
                </label>
                <label>
                    채널 최대 인원
                    <input type="number" placeholder="채널 최대 인원" name="c_maxUser" value={channelData.c_maxUser} onChange={handleChange} min="1" max="20" required />
                </label>
                <button type="submit">생성하기</button>
                <button style={{color:"black"}} onClick={toggleModal}>닫기</button>
            </form>
        </Modal>
    );
}

export default ChannelModal;