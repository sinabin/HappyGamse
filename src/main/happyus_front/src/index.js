import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App";
import "bootstrap/dist/css/bootstrap.css"
import {ChannelProvider} from "./contexts/ChannelContext";
import { AuthenticationProvider } from './contexts/AuthenticationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // 랜더링할 컴포넌트들을 작성해준다.
        <React.StrictMode>
            <AuthenticationProvider>
            <ChannelProvider>
            <App />
            </ChannelProvider>
            </AuthenticationProvider>
        </React.StrictMode>
);

