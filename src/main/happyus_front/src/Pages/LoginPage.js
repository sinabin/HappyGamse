import React, {useState} from 'react';

const styles = {
    container: {
        color: "white",
        padding: "20px",
        width: "300px",
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

function LoginPage() {
    const [user_id, setUser_id] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        fetch('/loginAction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username" : user_id,
                "password" : password
            }),
            credentials: 'include', // 쿠키를 자동으로 포함시킴
            redirect: 'follow' // 리다이렉트를 자동으로 따르도록 설정
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => {
                console.error('Error:', error);
            });

    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}><img alt="header_logo" style={{display: "inline"}} src="/imgs/header_logo.png" /> HappyUS</h2>
            <div style={styles.inputGroup}>
                <label style={styles.label}>
                    아이디:
                    <input
                        type="text"
                        value={user_id}
                        onChange={(e) => setUser_id(e.target.value)}
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
            <div>
                <button onClick={handleLogin} style={styles.button}>로그인</button>
            </div>
        </div>
    );
}

export default LoginPage;