/**
 * LoginPage - User login page
 *
 * Allows users to log in with user ID and password.
 * Includes client-side validation and error handling.
 */

import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthenticationContext';
import { getValidationError } from '../../utils/validation';
import LoadingSpinner from '../../Common/LoadingSpinner';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        userId: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    // Get the page user tried to access before being redirected to login
    const from = location.state?.from || '/';

    /**
     * Handle input change with real-time validation
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Clear server error
        if (serverError) {
            setServerError('');
        }
    };

    /**
     * Handle input blur - validate field
     */
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = getValidationError(name, value);

        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    /**
     * Validate all fields before submission
     */
    const validateForm = () => {
        const newErrors = {};

        // Validate user ID
        const userIdError = getValidationError('userId', formData.userId);
        if (userIdError) {
            newErrors.userId = userIdError;
        }

        // Validate password
        const passwordError = getValidationError('password', formData.password);
        if (passwordError) {
            newErrors.password = passwordError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await login(formData.userId, formData.password);

            if (result.success) {
                // Success - navigate to original destination or home
                navigate(from, { replace: true });
            } else {
                // Login failed - show error message
                setServerError(result.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setServerError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading spinner while checking authentication
    if (authLoading) {
        return <LoadingSpinner fullScreen message="인증 확인 중..." />;
    }

    return (
        <div className="login-page-wrapper">
            <Card className="login-card">
                <Card.Body>
                    <h2 className="text-center mb-4">로그인</h2>

                    {serverError && (
                        <Alert variant="danger" onClose={() => setServerError('')} dismissible>
                            {serverError}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        {/* User ID Field */}
                        <Form.Group className="mb-3" controlId="userId">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control
                                type="text"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!errors.userId}
                                placeholder="아이디를 입력하세요"
                                disabled={isSubmitting}
                                autoFocus
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.userId}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Password Field */}
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!errors.password}
                                placeholder="비밀번호를 입력하세요"
                                disabled={isSubmitting}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Submit Button */}
                        <Button
                            variant="primary"
                            type="submit"
                            className="btn-login"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    로그인 중...
                                </>
                            ) : (
                                '로그인'
                            )}
                        </Button>

                        {/* Links */}
                        <div className="login-links">
                            <Link to="/find-account">
                                아이디/비밀번호 찾기
                            </Link>
                            <span>|</span>
                            <Link to="/agreement">
                                회원가입
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LoginPage;
