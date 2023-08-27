import React, { useState } from 'react';

const styles = {
    container: {
        color: "white",
        padding: "20px",
        width: "400px",
        margin: "100px auto",
        boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
        borderRadius: "10px",
        backgroundColor: "#333",
    },
    header: {
        textAlign: "center",
        marginBottom: "20px",
    },
    inputGroup: {
        marginBottom: "15px",
    },
    label: {
        display: "block",
        marginBottom: "5px",
    },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#FF5733",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

function SignupPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');  // 비밀번호 확인을 위한 상태 추가

    const handleSignup = () => {
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        //회원가입 API 호출
        console.log('ID:', id, 'Password:', password);  // 임시 로그 출력
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.header}><img alt="header_logo" style={{display: "inline"}} src="/imgs/header_logo.png" /> HappyUS - 회원가입</h2>
            <div style={styles.inputGroup}>
                <label style={styles.label}>
                    아이디:
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="아이디 입력"
                        style={styles.input}
                    />
                </label>
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}>
                    비밀번호:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호 입력"
                        style={styles.input}
                    />
                </label>
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}>
                    비밀번호 확인:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호 재입력"
                        style={styles.input}
                    />
                </label>
            </div>
            <div>
                <button onClick={handleSignup} style={styles.button}>회원가입</button>
            </div>
        </div>
    );
}

export default SignupPage;