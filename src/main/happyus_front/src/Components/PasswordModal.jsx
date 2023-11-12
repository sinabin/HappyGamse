import React, { useState } from 'react';
import './PasswordModal.css';

function PasswordModal({ show, onSubmit, onClose }) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(password);
    }

    return show && (
        <div className="password-modal-background">
            <div className="password-modal-content">
                <h2>비밀번호 입력하기</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        비밀번호
                        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <button type="submit">확인</button>
                    <button style={{color:"black"}} onClick={onClose}>닫기</button>
                </form>
            </div>
        </div>
    );
}

export default PasswordModal;
