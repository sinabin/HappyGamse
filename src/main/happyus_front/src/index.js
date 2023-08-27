import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App";
import "bootstrap/dist/css/bootstrap.css" // react bootstrap 2.6.0 == 부트스트랩 5.2버전과 동일

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // 랜더링할 컴포넌트들을 작성해준다.
        <React.StrictMode>
            <App />
        </React.StrictMode>
);

