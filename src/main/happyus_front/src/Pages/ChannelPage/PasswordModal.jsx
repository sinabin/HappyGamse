import React, { useState } from 'react';
import Modal from "../../Common/Modal";

function PasswordModal({ show, onSubmit, onClose }) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(password);
    }

    return (
        <Modal show={show} title="비밀번호 입력하기" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label>비밀번호
                    <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">확인</button>
                <button style={{color:"black"}} onClick={onClose}>닫기</button>
            </form>
        </Modal>
    );
}

export default PasswordModal;
