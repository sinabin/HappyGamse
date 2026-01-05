/**
 * FindAccountPage - Account recovery page
 *
 * Provides two features:
 * 1. Find user ID by mobile number
 * 2. Reset password by mobile number
 */

import React, { useState } from 'react';
import { Container, Form, Button, Card, Tabs, Tab, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../../contexts/axiosInstance';
import { getValidationError, ValidationRegex } from '../../utils/validation';
import axios from 'axios';

const FindAccountPage = () => {
    const [activeTab, setActiveTab] = useState('findId');

    // Find ID state
    const [findIdPhone, setFindIdPhone] = useState('');
    const [findIdResult, setFindIdResult] = useState('');
    const [findIdError, setFindIdError] = useState('');
    const [findIdLoading, setFindIdLoading] = useState(false);

    // Reset Password state
    const [resetData, setResetData] = useState({
        userId: '',
        phoneNumber: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [resetErrors, setResetErrors] = useState({});
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    /**
     * Handle Find ID submission
     */
    const handleFindId = async () => {
        setFindIdError('');
        setFindIdResult('');

        if (!ValidationRegex.phoneNumber.test(findIdPhone)) {
            setFindIdError('올바른 핸드폰 번호를 입력해주세요.');
            return;
        }

        setFindIdLoading(true);

        try {
            const response = await authAPI.findId(findIdPhone);
            const result = typeof response.data === 'string' ? response.data : '아이디를 찾았습니다.';
            setFindIdResult(result);
        } catch (error) {
            console.error('Find ID failed:', error);
            const message = error.response?.data || '아이디 찾기에 실패했습니다.';
            setFindIdError(message);
        } finally {
            setFindIdLoading(false);
        }
    };

    /**
     * Request verification code for password reset
     */
    const handleRequestCode = async () => {
        if (!ValidationRegex.phoneNumber.test(resetData.phoneNumber)) {
            setResetErrors(prev => ({ ...prev, phoneNumber: '올바른 핸드폰 번호를 입력해주세요.' }));
            return;
        }

        try {
            await axios.post('/request/account/verificationCode', {
                to: resetData.phoneNumber
            });

            alert('인증번호가 발송되었습니다.');
            setIsCodeSent(true);
        } catch (error) {
            console.error('Verification code request failed:', error);
            alert(error.response?.data || '인증번호 발송에 실패했습니다.');
        }
    };

    /**
     * Verify code for password reset
     */
    const handleVerifyCode = async () => {
        if (resetData.verificationCode.length !== 6) {
            alert('올바른 인증번호를 입력해주세요.');
            return;
        }

        try {
            const response = await authAPI.verifyPhone(
                resetData.phoneNumber,
                resetData.verificationCode
            );

            if (response.data.verification_result === true) {
                alert('인증이 완료되었습니다.');
                setIsVerified(true);
            } else {
                alert('인증에 실패하였습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Verification failed:', error);
            alert('인증 중 오류가 발생했습니다.');
        }
    };

    /**
     * Handle password reset submission
     */
    const handleResetPassword = async () => {
        const newErrors = {};

        // Validate user ID
        if (!ValidationRegex.userId.test(resetData.userId)) {
            newErrors.userId = '6~25자의 영문 대소문자와 숫자로 이루어져야 합니다.';
        }

        // Validate new password
        const passwordError = getValidationError('password', resetData.newPassword);
        if (passwordError) {
            newErrors.newPassword = passwordError;
        }

        // Validate password confirmation
        if (resetData.newPassword !== resetData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }

        // Check verification
        if (!isVerified) {
            newErrors.phoneNumber = '핸드폰 인증을 완료해주세요.';
        }

        setResetErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setResetLoading(true);

        try {
            const response = await authAPI.resetPassword(resetData.phoneNumber, resetData.newPassword);
            const message = typeof response.data === 'string' ? response.data : '비밀번호가 재설정되었습니다.';
            alert(message);
            setResetSuccess(true);
        } catch (error) {
            console.error('Password reset failed:', error);
            const message = error.response?.data || '비밀번호 재설정에 실패했습니다.';
            alert(message);
        } finally {
            setResetLoading(false);
        }
    };

    /**
     * Handle tab change
     */
    const handleTabChange = (key) => {
        setActiveTab(key);
        // Reset state when changing tabs
        setFindIdPhone('');
        setFindIdResult('');
        setFindIdError('');
        setResetData({
            userId: '',
            phoneNumber: '',
            verificationCode: '',
            newPassword: '',
            confirmPassword: ''
        });
        setResetErrors({});
        setIsCodeSent(false);
        setIsVerified(false);
        setResetSuccess(false);
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">계정 찾기</h2>

                    <Tabs
                        activeKey={activeTab}
                        onSelect={handleTabChange}
                        className="mb-4"
                        justify
                    >
                        {/* Find ID Tab */}
                        <Tab eventKey="findId" title="아이디 찾기">
                            <div className="mt-4">
                                <p className="text-muted">
                                    회원가입 시 등록했던 핸드폰 번호를 입력해주세요.
                                </p>

                                <Form.Group className="mb-3">
                                    <Form.Label>핸드폰 번호</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={findIdPhone}
                                        onChange={(e) => setFindIdPhone(e.target.value)}
                                        placeholder="01012345678"
                                        maxLength={11}
                                        disabled={findIdLoading}
                                    />
                                </Form.Group>

                                {findIdError && (
                                    <Alert variant="danger">{findIdError}</Alert>
                                )}

                                {findIdResult && (
                                    <Alert variant="success">
                                        {findIdResult}
                                    </Alert>
                                )}

                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        onClick={handleFindId}
                                        disabled={findIdLoading}
                                    >
                                        {findIdLoading ? '찾는 중...' : '아이디 찾기'}
                                    </Button>
                                    <Link to="/login">
                                        <Button variant="outline-secondary" className="w-100">
                                            로그인 페이지로
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Tab>

                        {/* Reset Password Tab */}
                        <Tab eventKey="resetPassword" title="비밀번호 재설정">
                            <div className="mt-4">
                                {!resetSuccess ? (
                                    <>
                                        <p className="text-muted">
                                            아이디와 핸드폰 번호를 입력하여 비밀번호를 재설정하세요.
                                        </p>

                                        <Form.Group className="mb-3">
                                            <Form.Label>아이디</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={resetData.userId}
                                                onChange={(e) => setResetData(prev => ({ ...prev, userId: e.target.value }))}
                                                placeholder="아이디를 입력하세요"
                                                isInvalid={!!resetErrors.userId}
                                                disabled={resetLoading}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {resetErrors.userId}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>핸드폰 번호</Form.Label>
                                            <div className="d-flex gap-2">
                                                <Form.Control
                                                    type="text"
                                                    value={resetData.phoneNumber}
                                                    onChange={(e) => setResetData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                                    placeholder="01012345678"
                                                    maxLength={11}
                                                    isInvalid={!!resetErrors.phoneNumber}
                                                    disabled={isVerified || resetLoading}
                                                />
                                                <Button
                                                    variant={isCodeSent ? "secondary" : "primary"}
                                                    onClick={handleRequestCode}
                                                    disabled={isVerified || resetLoading}
                                                    style={{ minWidth: '120px' }}
                                                >
                                                    {isCodeSent ? '재요청' : '인증번호 요청'}
                                                </Button>
                                            </div>
                                            <Form.Control.Feedback type="invalid" className="d-block">
                                                {resetErrors.phoneNumber}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {isCodeSent && !isVerified && (
                                            <Form.Group className="mb-3">
                                                <Form.Label>인증번호</Form.Label>
                                                <div className="d-flex gap-2">
                                                    <Form.Control
                                                        type="text"
                                                        value={resetData.verificationCode}
                                                        onChange={(e) => setResetData(prev => ({ ...prev, verificationCode: e.target.value }))}
                                                        placeholder="6자리 인증번호"
                                                        maxLength={6}
                                                        disabled={isVerified || resetLoading}
                                                    />
                                                    <Button
                                                        variant="success"
                                                        onClick={handleVerifyCode}
                                                        disabled={isVerified || resetLoading || resetData.verificationCode.length !== 6}
                                                        style={{ minWidth: '120px' }}
                                                    >
                                                        인증하기
                                                    </Button>
                                                </div>
                                            </Form.Group>
                                        )}

                                        {isVerified && (
                                            <>
                                                <Alert variant="success" className="mb-3">
                                                    ✓ 인증이 완료되었습니다. 새 비밀번호를 입력하세요.
                                                </Alert>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>새 비밀번호</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        value={resetData.newPassword}
                                                        onChange={(e) => setResetData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                        placeholder="10자 이상, 대소문자, 숫자, 특수문자 포함"
                                                        isInvalid={!!resetErrors.newPassword}
                                                        disabled={resetLoading}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {resetErrors.newPassword}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>비밀번호 확인</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        value={resetData.confirmPassword}
                                                        onChange={(e) => setResetData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                        placeholder="비밀번호를 다시 입력하세요"
                                                        isInvalid={!!resetErrors.confirmPassword}
                                                        disabled={resetLoading}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {resetErrors.confirmPassword}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </>
                                        )}

                                        <div className="d-grid gap-2">
                                            <Button
                                                variant="primary"
                                                onClick={handleResetPassword}
                                                disabled={!isVerified || resetLoading}
                                            >
                                                {resetLoading ? '재설정 중...' : '비밀번호 재설정'}
                                            </Button>
                                            <Link to="/login">
                                                <Button variant="outline-secondary" className="w-100">
                                                    취소
                                                </Button>
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <Alert variant="success">
                                            비밀번호가 성공적으로 재설정되었습니다!
                                        </Alert>
                                        <Link to="/login">
                                            <Button variant="primary">로그인하러 가기</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FindAccountPage;
