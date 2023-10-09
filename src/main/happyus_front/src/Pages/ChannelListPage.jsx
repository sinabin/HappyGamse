import React, {useContext, useEffect, useState} from 'react';
import "./ChannelListPage.css"
import axios from "axios";
import Pagination from "../Components/Pagination";
import { Link } from 'react-router-dom';
import {ChannelContext} from "../contexts/ChannelContext";
import {usePagination} from "../hooks/usePagination";
import {useAuthentication} from "../contexts/AuthenticationContext";

function ChannelListPage() {

    let [channelList, setChannelList] = useState([]); // 채널 리스트 data
    const [showDesc, setShowDesc] = useState(new Array(channelList.length).fill(false)); // 채널 소개
    const { setSelectedChannel } = useContext(ChannelContext); // 선택한 채널 상태값을 전역으로 관리

    // 페이징 관련
    const [totalCount, setTotalCount] = useState(0);// 총 채널 건수
    const { page, setPage, buttonRange, PAGE_SIZE } = usePagination(totalCount); // 페이징 관련 custom hook

    const isLogined = useAuthentication(); // 로그인 정보


    useEffect(() => {
        fetchChannelList();
    }, [page]);

    async function fetchChannelList() {
        try {
            const response = await axios.get('/api/channel/list', { params: { page: page, size: PAGE_SIZE } });
            if (response.status === 200) {
                setChannelList(response.data.channelList);
                setShowDesc(new Array(response.data.channelList.length).fill(false));
                setTotalCount(response.data.paging.total_count);
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
    }

    // 클릭한 채널명 상태값 갱신
    function clickSpan(index, event) {
        event.stopPropagation();
        let newShowDesc=[...showDesc];
        newShowDesc[index]=!newShowDesc[index];
        setShowDesc(newShowDesc);
    }

    // 클릭한 채널 상태값 갱신
    function handleLinkClick(channel, event) {
        if (!isLogined) {
            alert("로그인이 필요합니다");
            event.preventDefault();  // 기본 동작을 방지하여 페이지 이동을 막습니다.
            return;
        }
        setSelectedChannel(channel);
    }

    return (
        <div id={"friend-container"}>
            <h1 style={{textAlign:"center", paddingTop:"30px", color:"white"}}>
                🎮 🎮 🎮 🎮 🎮
            </h1>
            <br />
            <button id="btn-all-close" >채널 생성하기</button>

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
                            <td className="table-channel-playerCount">{channel.c_playerCount}</td>
                            <td className="table-channel-heartCount">{channel.c_heartCount}</td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan={5}>현재 생성된 채널이 없습니다.</td></tr>
                )}

            </tbody>
            </table>

            <Pagination buttonRange={buttonRange} totalCount={totalCount} setPage={setPage} pageSize={PAGE_SIZE} />
        </div>

);
}
export default ChannelListPage;
