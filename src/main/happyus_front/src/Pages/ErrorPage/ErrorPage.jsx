/**
 * ErrorPage - HTTP error display page
 *
 * Displays user-friendly error messages for various HTTP status codes.
 * Provides navigation back to home page.
 */

import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ErrorPage = ({ code }) => {
    const { code: urlCode } = useParams();
    const navigate = useNavigate();
    const errorCode = parseInt(urlCode || code || 404);

    const errorMessages = {
        400: {
            title: 'Bad Request',
            message: '잘못된 요청입니다.',
            description: '요청 형식이 올바르지 않습니다. 다시 시도해주세요.'
        },
        401: {
            title: 'Unauthorized',
            message: '인증이 필요합니다.',
            description: '로그인이 필요한 페이지입니다.'
        },
        403: {
            title: 'Forbidden',
            message: '접근 권한이 없습니다.',
            description: '이 페이지에 접근할 권한이 없습니다.'
        },
        404: {
            title: 'Not Found',
            message: '페이지를 찾을 수 없습니다.',
            description: '요청하신 페이지가 존재하지 않거나 이동했습니다.'
        },
        500: {
            title: 'Internal Server Error',
            message: '서버 오류가 발생했습니다.',
            description: '일시적인 서버 오류입니다. 잠시 후 다시 시도해주세요.'
        },
        503: {
            title: 'Service Unavailable',
            message: '서비스를 사용할 수 없습니다.',
            description: '서버 점검 중이거나 일시적으로 사용할 수 없습니다.'
        }
    };

    const error = errorMessages[errorCode] || errorMessages[404];

    return (
        <Container className="mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Card style={{ maxWidth: '600px', width: '100%' }} className="text-center shadow">
                <Card.Body className="p-5">
                    <div className="mb-4">
                        <h1 className="display-1 fw-bold text-primary">{errorCode}</h1>
                        <h2 className="h4 text-secondary mb-3">{error.title}</h2>
                    </div>

                    <div className="mb-4">
                        <p className="h5 mb-2">{error.message}</p>
                        <p className="text-muted">{error.description}</p>
                    </div>

                    <div className="d-grid gap-2 d-md-block">
                        <Link to="/">
                            <Button variant="primary" size="lg" className="me-md-2">
                                홈으로 돌아가기
                            </Button>
                        </Link>
                        <Button
                            variant="outline-secondary"
                            size="lg"
                            onClick={() => navigate(-1)}
                        >
                            이전 페이지로
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ErrorPage;
