import React, {useContext, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ChannelContext} from "../contexts/ChannelContext"; // useParams를 불러옵니다.
import "./ChannelDetailPage.css"

function ChannelDetailPage() {

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const { channel_id } = useParams(); // URL 파라미터에서 channel_id를 추출

    const { selectedChannel } = useContext(ChannelContext); // 채널 제목
    const chatWindowRef = useRef(null); // chat-window에 대한 참조를 생성

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight; // 스크롤을 최하단으로 이동
        }
    }, [chat]); // 채팅이 일어날 때마다 변경

    // 채널에서 퇴장하는 함수
    const leaveChannel = (channelId) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                action: 'leave_channel',
                channelId: channelId,
            };
            socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket connection is not open.');
        }
    };

    useEffect(() => {
        connectWebSocket();
    }, []);



    const connectWebSocket = () => {
        const newSocket = new WebSocket('ws://127.0.0.1:8081/ws');

        // 채널에 입장하는 함수
        const joinChannel = (channel_id) => {
            if (newSocket && newSocket.readyState === WebSocket.OPEN) {
                const message = {
                    action: 'join_channel',
                    channelId: channel_id,
                };
                newSocket.send(JSON.stringify(message));
            } else {
                console.error('WebSocket connection is not open.');
            }
        };

        newSocket.addEventListener('open', (event) => {
            setSocket(newSocket);
            joinChannel(channel_id); // 'open' 이벤트 핸들러 내에서 채널 입장 로직을 호출합니다.
        });

        newSocket.addEventListener('close', (event) => {
            setSocket(null);
        });

        newSocket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
        });

        newSocket.addEventListener('message', (event) => {
            const response = JSON.parse(event.data);

            if (response.action === 'joined_channel') {
                alert(response.message);
            }else if (response.action === 'message') {
                const newMessage = `${response.sender}: ${response.message}`;
                setChat((prevChat) => [...prevChat, newMessage]);
            }
        });
    };

    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            if (message.trim() !== '') {
                socket.send(JSON.stringify({
                    action: 'message',
                    channelId: channel_id, // 채널 ID를 여기에 추가해야 합니다.
                    message: message
                }));
                setMessage('');
            }
        } else {
            console.error('WebSocket connection is not open.');
        }
    };

    return (
        <div className="channel-detail-container">
            <h1 className="channel-detail-title">{ selectedChannel?.c_title }</h1>
            <div className="chat-window" ref={chatWindowRef}>  {/* ref 속성을 추가하여 참조 연결 */}
                {chat.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <span className="chat-user">{msg.split(':')[0]}</span>: <span>{msg.split(':')[1]}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                            e.preventDefault(); // Enter 키 누르면 발생하는 기본 동작(새 줄 추가 등)을 방지합니다.
                        }
                    }}
                    placeholder="보낼 메시지를 입력"
                    className="chat-input"
                />
                <button onClick={sendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
}

export default ChannelDetailPage;