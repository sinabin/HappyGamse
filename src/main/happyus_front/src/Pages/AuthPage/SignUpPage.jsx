/**
 * SignUpPage - User registration page
 *
 * Complete signup form with phone verification.
 * Includes real-time validation and password strength indicator.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert, Card, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../contexts/axiosInstance';
import {
    getValidationError,
    validatePasswordMatch,
    getPasswordStrength,
    ValidationRegex
} from '../../utils/validation';
import axios from 'axios';
import './SignUpPage.css';

const SignUpPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        passwordConfirm: '',
        email: '',
        phoneNumber: '',
        birthDate: '',
        verificationCode: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Phone verification state
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const timerRef = useRef(null);

    // Password strength
    const [passwordStrength, setPasswordStrength] = useState(0);

    /**
     * Clear timer on unmount
     */
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    /**
     * Update password strength when password changes
     */
    useEffect(() => {
        const strength = getPasswordStrength(formData.password);
        setPasswordStrength(strength);
    }, [formData.password]);

    /**
     * Handle input change
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear field error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setServerError('');
    };

    /**
     * Handle input blur - validate field
     */
    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (name === 'passwordConfirm') {
            const error = validatePasswordMatch(formData.password, value);
            if (error) {
                setErrors(prev => ({ ...prev, passwordConfirm: error }));
            }
        } else {
            const error = getValidationError(name, value);
            if (error) {
                setErrors(prev => ({ ...prev, [name]: error }));
            }
        }
    };

    /**
     * Request verification code
     */
    const handleRequestCode = async () => {
        // Validate phone number
        if (!ValidationRegex.phoneNumber.test(formData.phoneNumber)) {
            setErrors(prev => ({ ...prev, phoneNumber: '올바른 핸드폰 번호를 입력해주세요.' }));
            return;
        }

        try {
            await axios.post('/request/verificationCode', {
                to: formData.phoneNumber
            });

            alert('인증번호가 발송되었습니다.');
            setIsCodeSent(true);

            // Start 3-minute countdown
            setCountdown(180);
            timerRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (error) {
            console.error('Verification code request failed:', error);
            alert(error.response?.data || '인증번호 발송에 실패했습니다.');
        }
    };

    /**
     * Verify code
     */
    const handleVerifyCode = async () => {
        if (formData.verificationCode.length !== 6) {
            alert('올바른 인증번호를 입력해주세요.');
            return;
        }

        setIsVerifying(true);

        try {
            const response = await authAPI.verifyPhone(
                formData.phoneNumber,
                formData.verificationCode
            );

            if (response.data.verification_result === true) {
                alert('인증이 완료되었습니다.');
                setIsPhoneVerified(true);

                // Clear timer
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                setCountdown(0);
            } else {
                alert('인증에 실패하였습니다. 다시 시도해주세요.');
                setIsPhoneVerified(false);
            }
        } catch (error) {
            console.error('Verification failed:', error);
            alert('인증 중 오류가 발생했습니다.');
            setIsPhoneVerified(false);
        } finally {
            setIsVerifying(false);
        }
    };

    /**
     * Validate all fields
     */
    const validateForm = () => {
        const newErrors = {};

        // Required fields
        const requiredFields = ['userId', 'password', 'birthDate', 'phoneNumber'];
        requiredFields.forEach(field => {
            const error = getValidationError(field, formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        // Password confirmation
        const matchError = validatePasswordMatch(formData.password, formData.passwordConfirm);
        if (matchError) {
            newErrors.passwordConfirm = matchError;
        }

        // Email (optional, but validate if provided)
        if (formData.email && !ValidationRegex.email.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다.';
        }

        // Phone verification
        if (!isPhoneVerified) {
            newErrors.phoneNumber = '핸드폰 번호 인증을 완료해주세요.';
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
            const response = await authAPI.signup({
                user_id: formData.userId,
                password: formData.password,
                confirm_password: formData.passwordConfirm,
                birth_date: formData.birthDate,
                phone_number: formData.phoneNumber,
                verified_code: formData.verificationCode,
                email: formData.email
            });

            // Success
            const message = typeof response.data === 'string' ? response.data : '회원가입이 완료되었습니다.';
            setSuccessMessage(message);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Signup failed:', error);
            const message = error.response?.data || '회원가입 중 오류가 발생했습니다.';
            setServerError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format countdown time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Password strength variant
    const getStrengthVariant = () => {
        if (passwordStrength === 0) return 'danger';
        if (passwordStrength <= 2) return 'warning';
        if (passwordStrength === 3) return 'info';
        return 'success';
    };

    const getStrengthLabel = () => {
        if (passwordStrength === 0) return '매우 약함';
        if (passwordStrength <= 2) return '약함';
        if (passwordStrength === 3) return '보통';
        return '강함';
    };

    return (
        <div className="signup-page-wrapper">
            <div className="signup-container">
                <Card className="signup-card">
                    <Card.Body>
                        <h2 className="signup-title">회원가입</h2>

                        {serverError && (
                            <Alert variant="danger" onClose={() => setServerError('')} dismissible>
                                {serverError}
                            </Alert>
                        )}

                        {successMessage && (
                            <Alert variant="success">
                                {successMessage}
                                <br />
                                <small>로그인 페이지로 이동합니다...</small>
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            {/* User ID */}
                            <Form.Group className="mb-3" controlId="userId">
                                <Form.Label className="signup-label">아이디 <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!errors.userId}
                                    placeholder="6~25자의 영문, 숫자"
                                    disabled={isSubmitting}
                                    className="signup-input"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.userId}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Password */}
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label className="signup-label">비밀번호 <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!errors.password}
                                    placeholder="10자 이상, 대소문자, 숫자, 특수문자 포함"
                                    disabled={isSubmitting}
                                    className="signup-input"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                                {formData.password && (
                                    <div className="mt-2">
                                        <ProgressBar
                                            now={(passwordStrength / 4) * 100}
                                            variant={getStrengthVariant()}
                                            label={getStrengthLabel()}
                                        />
                                    </div>
                                )}
                            </Form.Group>

                            {/* Password Confirm */}
                            <Form.Group className="mb-3" controlId="passwordConfirm">
                                <Form.Label className="signup-label">비밀번호 확인 <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="password"
                                    name="passwordConfirm"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!errors.passwordConfirm}
                                    placeholder="비밀번호를 다시 입력하세요"
                                    disabled={isSubmitting}
                                    className="signup-input"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.passwordConfirm}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Email (Optional) */}
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="signup-label">이메일</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!errors.email}
                                    placeholder="example@domain.com (선택사항)"
                                    disabled={isSubmitting}
                                    className="signup-input"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Birth Date */}
                            <Form.Group className="mb-3" controlId="birthDate">
                                <Form.Label className="signup-label">생년월일 <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!errors.birthDate}
                                    disabled={isSubmitting}
                                    className="signup-input"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.birthDate}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Phone Number with Verification */}
                            <Form.Group className="mb-3">
                                <Form.Label className="signup-label">전화번호 <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!errors.phoneNumber}
                                    placeholder="01012345678"
                                    disabled={isSubmitting || isPhoneVerified}
                                    maxLength={11}
                                    className="signup-input"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phoneNumber}
                                </Form.Control.Feedback>
                                
                                <Button
                                    variant={isCodeSent ? "secondary" : "primary"}
                                    onClick={handleRequestCode}
                                    disabled={isSubmitting || isPhoneVerified || countdown > 0}
                                    className={`signup-btn-block ${isCodeSent ? 'signup-btn-secondary' : 'signup-btn-primary'}`}
                                >
                                    {countdown > 0 ? formatTime(countdown) : (isCodeSent ? '재요청' : '인증번호 요청')}
                                </Button>
                            </Form.Group>

                            {/* Verification Code */}
                            {isCodeSent && !isPhoneVerified && (
                                <Form.Group className="mb-3">
                                    <Form.Label className="signup-label">인증번호</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="verificationCode"
                                        value={formData.verificationCode}
                                        onChange={handleChange}
                                        placeholder="6자리 인증번호"
                                        disabled={isSubmitting || isPhoneVerified}
                                        maxLength={6}
                                        className="signup-input"
                                    />
                                    <Button
                                        variant="success"
                                        onClick={handleVerifyCode}
                                        disabled={isSubmitting || isVerifying || isPhoneVerified || formData.verificationCode.length !== 6}
                                        className="signup-btn-block signup-btn-primary"
                                    >
                                        {isVerifying ? '확인 중...' : '인증하기'}
                                    </Button>
                                </Form.Group>
                            )}

                            {isPhoneVerified && (
                                <Alert variant="success" className="mb-3">
                                    ✓ 전화번호 인증이 완료되었습니다.
                                </Alert>
                            )}

                            {/* Submit Buttons */}
                            <div className="signup-actions">
                                <Button
                                    type="submit"
                                    className="btn-action-submit"
                                    disabled={isSubmitting || !isPhoneVerified}
                                >
                                    {isSubmitting ? '가입 중...' : '회원가입'}
                                </Button>
                                <Button
                                    className="btn-action-cancel"
                                    onClick={() => navigate('/login')}
                                    disabled={isSubmitting}
                                >
                                    취소
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default SignUpPage;
