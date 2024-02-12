import axios from 'axios';

// baseURL 없이 axios 인스턴스 생성
const axiosInstance = axios.create();

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
    config => {
        // 요청을 보내기 전에 수행할 로직 작성
        return config;
    },
    error => {
        // 요청 에러 처리
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        let errorMessage = "알 수 없는 오류가 발생했습니다.";
        if (error.response) {
            // 1. response에서 message 추출
            const status = error.response.status;
            if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            }

            // 2. StatusCode에 따른 처리
            if (status >= 400 && status < 500) {
                alert(`${errorMessage}`);
            } else if (status >= 500) {
                alert(`${errorMessage}`);
            }

            // 3. 개발 환경에서만 상세 에러 정보 출력
            if (process.env.REACT_APP_LOG_LEVEL === 'debug') {
                console.error('Debug Info:', error.response);
            }

        } else if (error.request) {
            // 요청이 이루어졌으나 응답을 받지 못한 경우
            console.log('응답을 받지 못했습니다.', error.request);
        } else {
            // 요청 설정 중 발생한 오류
            console.log('Error', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
