/**
 * ErrorBoundary - React error boundary component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */

import React from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // You can also log to an error reporting service here
        // e.g., Sentry, LogRocket, etc.
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });

        // Navigate to home page
        window.location.href = '/';
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container className="mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <Card style={{ maxWidth: '700px', width: '100%' }} className="shadow">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h1 className="display-4 text-danger">⚠️</h1>
                                <h2 className="h4 mb-3">문제가 발생했습니다</h2>
                                <p className="text-muted">
                                    예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다.
                                </p>
                            </div>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <Alert variant="danger" className="mb-4">
                                    <Alert.Heading className="h6">개발자 정보</Alert.Heading>
                                    <details className="mt-2">
                                        <summary style={{ cursor: 'pointer' }}>
                                            <strong>Error:</strong> {this.state.error.toString()}
                                        </summary>
                                        <pre className="mt-2 p-2 bg-light" style={{
                                            fontSize: '0.85rem',
                                            maxHeight: '200px',
                                            overflowY: 'auto'
                                        }}>
                                            {this.state.errorInfo?.componentStack}
                                        </pre>
                                    </details>
                                </Alert>
                            )}

                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={this.handleReload}
                                >
                                    페이지 새로고침
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={this.handleReset}
                                >
                                    홈으로 돌아가기
                                </Button>
                            </div>

                            <div className="mt-4 text-center">
                                <small className="text-muted">
                                    문제가 계속되면 관리자에게 문의해주세요.
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
