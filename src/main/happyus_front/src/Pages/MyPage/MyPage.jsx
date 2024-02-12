import React, {useEffect, useState} from 'react';
import axios from "axios";
import './MyPage.css';
import axiosInstance from "../../contexts/axiosInstance";

function MyPage(){

    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerificated, setIsVerificated] = useState(false);
    const [userInfo, setUnserInfo] = useState("")

    useEffect(() => {
        const fetchMypage = async () => {
            const response = await axiosInstance.post('/user/myPage', {});
            setUnserInfo(response.data);
        }
        fetchMypage();
    }, []);

    const requestResetPassword = async () => {
        if (isVerificated) {
            if (newPassword === newPassword2) {
                const response = await axiosInstance.post('/request/resetPasswordByMobile', {
                    password: newPassword,
                    phone_number: userInfo.phone_number,
                });
                alert(response.data);
            } else {
                alert("비밀번호가 일치하지않습니다.");
                return;
            }
        } else {
            alert("핸드폰 인증을 먼저 완료해주세요.");
            return;
        }
    }

    const requestVerificationCodeForPW = async () => {
        let phoneNumber = userInfo.phone_number;
        let btnRequestCode = document.getElementById("btn_requestCode");

        const response
            = await axiosInstance.post('/request/account/verificationCode', {"to": phoneNumber})
        // 성공적으로 요청이 처리된 경우, 타이머 시작
        btnRequestCode.disabled = true; // 버튼 비활성화
        btnRequestCode.style.color = "#FFA500";
        let countdown = 180; // 3분 = 180초

        const timerId = setInterval(() => {
            countdown--;
            if (countdown <= 0) { // 카운트다운 종료
                clearInterval(timerId); // 타이머 중지
                btnRequestCode.innerText = "인증번호 재요청";
                btnRequestCode.disabled = false; // 버튼 활성화
            } else {
                const minutes = Math.floor(countdown / 60);
                const seconds = countdown % 60;
                btnRequestCode.innerText =
                    `인증번호 재요청 (${minutes}:${seconds < 10 ? '0' : ''}${seconds})`;
            }

        }, 1000); // 초당 업데이트
        alert(response.data)
    }

    const verifyCode = async () => {
        if (verificationCode.length === 6) {
            const response = await axiosInstance.post('/request/verification', {
                phone_number: userInfo.phone_number,
                sent_code: verificationCode,
            });
            if (response.data.verification_result) {
                alert("인증이 완료되었습니다.");
                setIsVerificated(true);
            } else {
                alert("인증에 실패하였습니다. 다시 시도해주세요.");
                setIsVerificated(false);
            }
        } else {
            alert("올바른 인증번호를 입력해주세요.");
        }
    }

    return (
        <div className="App">
            <div className="profile-container">
                <div className="section">
                    <div className="section-title">내 계정</div>
                    <div className="section-content">
                        <div className="content-row">
                            <div className="content-label">HappyGames ID</div>
                            <div className="content-value">{userInfo.user_id}</div>
                        </div>
                        <div className="content-row">
                            <div className="content-label">등록된 핸드폰 번호</div>
                            <div className="content-value">{userInfo.phone_number}</div>
                        </div>
                        <div className="content-row">
                            <div className="content-label">등록된 이메일</div>
                            <div className="content-value">{userInfo.email}</div>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="section-title">비밀번호 재설정하기</div>
                    <div className="section-content">
                        <div className="content-row">
                            <div className="content-label">핸드폰 인증번호 입력</div>
                            <input className="mypage-input" type="password" placeholder="모바일 인증번호를 입력해주세요" onChange={e => setVerificationCode(e.target.value)} />
                        </div>
                        <div className="content-row">
                            <button id="btn_requestCode" className="mypage-button blue" type="button" style={{marginRight:"10px"}} onClick={requestVerificationCodeForPW}>인증번호 요청</button>
                            <button className="mypage-button green" type="button" onClick={verifyCode}>인증하기</button>
                        </div>
                        <div className="content-row">
                            <div className="content-label">새로운 비밀번호 입력</div>
                            <input className="mypage-input" type="password" placeholder="새로운 비밀번호를 입력하세요." onChange={e => setNewPassword(e.target.value)} />
                        </div>
                        <div className="content-row">
                            <div className="content-label">새로운 비밀번호 재입력</div>
                            <input className="mypage-input" type="password" placeholder="새로운 비밀번호를 재입력하세요." onChange={e => setNewPassword2(e.target.value)} />
                        </div>
                        <button className="mypage-button" type="button" onClick={requestResetPassword}>비밀번호 변경</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPage;