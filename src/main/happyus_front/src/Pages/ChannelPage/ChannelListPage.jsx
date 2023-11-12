import React, {useContext, useEffect, useState} from 'react';
import "./ChannelListPage.css"
import axios from "axios";
import Pagination from "../../Components/Pagination";
import { Link } from 'react-router-dom';
import {ChannelContext} from "../../contexts/ChannelContext";
import {usePagination} from "../../hooks/usePagination";
import {useAuthentication} from "../../contexts/AuthenticationContext";
import ChannelModal from "./ChannelModal";
import PasswordModal from "./PasswordModal";
import { useNavigate, useLocation } from 'react-router-dom';

function ChannelListPage() {

    const navigate = useNavigate();

    let [channelList, setChannelList] = useState([]); // 채널 리스트 data
    const [showDesc, setShowDesc] = useState(new Array(channelList.length).fill(false)); // 채널 소개
    const { selectedChannel, setSelectedChannel } = useContext(ChannelContext);

    // 페이징 관련
    const [totalCount, setTotalCount] = useState(0);// 총 채널 건수
    const { page, setPage, buttonRange, PAGE_SIZE } = usePagination(totalCount); // 페이징 관련 custom hook

    const isLogined = useAuthentication(); // 로그인 정보
    const [userCount, setUserCount] = useState({}); // 채널 유저수

    // 모달 페이지 관련
    const [showChannelModal, setShowChannelModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    function toggleModal() {
        setShowChannelModal(!showChannelModal);
    }

    // 채널 인원수 data 요청
    useEffect( () => {
        const channelIds = channelList.map(channel => channel.c_id);

         axios.post('/api/channel/userCount', { "channelIds" : channelIds })
            .then(response => {
                setUserCount(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }, [channelList])


    // 채널 list Data 요청
    useEffect(() => {
        axios.get('/api/channel/list', { params: { page: page, size: PAGE_SIZE, list_type: "All" } })
            .then(response => {
                if (response.status === 200) {
                    setChannelList(response.data.channelList);
                    setShowDesc(new Array(response.data.channelList.length).fill(false));
                    setTotalCount(response.data.paging.total_count);
                }
            })
            .catch(error => {
                alert("채널 정보를 받아오는 도중 에러가 발생하였습니다. 다시 시도해주세요.")
                console.error('Error : ', error);
            });
    }, [page]);


    // 클릭한 채널명 상태값 갱신
    function clickSpan(index, event) {
        event.stopPropagation();
        let newShowDesc=[...showDesc];
        newShowDesc[index]=!newShowDesc[index];
        setShowDesc(newShowDesc);
    }


    function handleLinkClick(channel, event) {
        if (!isLogined) {
            event.preventDefault();
            alert("로그인이 필요합니다");
            return;
        }

        if (channel.c_type === 'private') { // 채널이 private인 경우
            event.preventDefault();
            setSelectedChannel(channel);
            setShowPasswordModal(true); // 비밀번호 입력 모달을 표시
        } else {
            setSelectedChannel(channel);
        }

    }

    const handlePasswordSubmit = async (password) => {
        if (await checkPassword(selectedChannel, password)) {
            navigate(`/friend/channel/${selectedChannel.c_id}`);
            setShowPasswordModal(false);
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    };

    const checkPassword = async (selectedChannel, password) => {
        try {
            const req_body =  {
                c_id :selectedChannel.c_id,
                c_password: password,
            }
            const response = await axios.post('/api/channel/CheckingChannelPW', req_body);
            return response.data;
        } catch (error) {
            console.error('There was an error!', error);
        }

        return false;
    };


    return (
        <div id={"friend-container"}>
            <h1 style={{textAlign:"center", paddingTop:"30px", color:"white"}}>
                🎮 🎮 🎮 🎮 🎮
            </h1>
            <br />
            <button id="btn-create-ch" onClick={toggleModal}>채널 생성하기</button>
            <ChannelModal showModal={showChannelModal} toggleModal={toggleModal} />
            <table className="table table-bordered table-striped table-dark table-hover">
                <caption>게임별 Voice Room</caption>
                <thead className="thead-light text-center">
                <tr>
                    <th style={{width:"100px"}}>채널 타입</th>
                    <th>채널명 / 채널 소개</th>
                    <th>플레이 게임</th>
                    <th>인원수</th>
                    <th>❤️</th>
                </tr>
                </thead>
                <tbody className="text-center">
                {channelList.length > 0 ? (
                    channelList.map((channel, index) => (
                        <tr key={index}>
                            <td className="table-channel-type">{channel.c_type}</td>
                            <td>
                                <div className="channel-container">
                                    <Link style={{textDecoration:"none"}} to={`/friend/channel/${channel.c_id}`} onClick={(event) => handleLinkClick(channel, event)}>
                                        <span className="channel-title">
                                            {channel.c_title}
                                        </span>
                                    </Link>
                                    <button className="btn-desc" onClick={(event) => clickSpan(index, event)}> 📌 채널 소개&nbsp;&nbsp;
                                    </button>
                                </div>
                                {showDesc[index] && (
                                    <div className="table-channel-desc">
                                        <p className={"channel-desc"}>{channel.c_desc}</p>
                                    </div>
                                )}
                            </td>
                            <td className="table-channel-subject">{channel.c_subject}</td>
                            <td className="table-channel-playerCount"> {userCount[channel.c_id] || 0} /{channel.c_maxUser}</td>
                            <td className="table-channel-heartCount">{channel.c_heartCount}</td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan={5}>현재 활성화된 채널이 없습니다.</td></tr>
                )}

            </tbody>
            </table>

            <Pagination buttonRange={buttonRange} totalCount={totalCount} setPage={setPage} pageSize={PAGE_SIZE} />
            <PasswordModal show={showPasswordModal} onSubmit={handlePasswordSubmit} onClose={() => setShowPasswordModal(false)} /> {/* 비밀번호 입력 모달을 추가합니다. */}
        </div>

);
}
export default ChannelListPage;
