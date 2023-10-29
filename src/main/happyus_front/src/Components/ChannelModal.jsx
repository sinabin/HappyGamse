import React, {useContext, useState} from "react";
import "./ChannelModal.css"
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import {ChannelContext} from "../contexts/ChannelContext";
function ChannelModal({ showModal, toggleModal }) {

    const navigate = useNavigate();

    const [channelData, setChannelData] = useState({
        c_title: '',
        c_desc: '',
        c_type: 'open',
        c_subject: '',
        c_maxUser: 0,
    });

    const { setSelectedChannel } = useContext(ChannelContext); // 선택한 채널명 상태값을 전역으로 관리

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChannelData(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post('/api/channel/create', channelData)
            .then(response => {
                alert(response.data.message);
                setSelectedChannel(channelData.c_title);
                navigate(`/friend/channel/${response.data.c_id}`);
            })
            .catch(error => {
                alert("채널 생성도중 에러가 발생했습니다.");
                console.error('There was an error!', error);
            });
    }


    return (
        showModal && (
            <div className="modal-background">
                <div className="modal-content">
                    <h2>채널 생성하기</h2>
                    <form  onSubmit={handleSubmit}>
                        <input type="text" placeholder="채널명" name="c_title" value={channelData.c_title} onChange={handleChange} required />
                        <input type="text" placeholder="채널 소개" name="c_desc" value={channelData.c_desc} onChange={handleChange} required />
                        <select name="c_type" value={channelData.c_type} onChange={handleChange} required>
                            <option value="open">Open</option>
                            <option value="private">Private</option>
                        </select>
                        <input type="text" placeholder="채널 주제" name="c_subject" value={channelData.c_subject} onChange={handleChange} required />
                        <input type="number" placeholder="채널 최대 인원" name="c_maxUser" value={channelData.c_maxUser} onChange={handleChange} min="1" max="20" required />
                        <button type="submit">생성하기</button>
                        <button onClick={toggleModal}>닫기</button>
                    </form>
                </div>
            </div>
        )
    );
}

export default ChannelModal;