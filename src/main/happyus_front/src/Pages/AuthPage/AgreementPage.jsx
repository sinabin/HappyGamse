/**
 * AgreementPage - Terms and privacy policy agreement page
 *
 * Displays service terms and privacy policy.
 * Users must agree to required terms before proceeding to signup.
 */

import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../Common/LoadingSpinner';
import './AgreementPage.css';

const AgreementPage = () => {
    const navigate = useNavigate();

    const [terms, setTerms] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [agreements, setAgreements] = useState({
        serviceTerms: false,
        privacyPolicy: false
    });

    /**
     * Fetch terms and privacy policy on mount
     */
    useEffect(() => {
        const fetchTerms = async () => {
            try {
                setLoading(true);
                const [termsRes, privacyRes] = await Promise.all([
                    axios.get('/api/terms/service'),
                    axios.get('/api/terms/privacy')
                ]);

                setTerms(termsRes.data);
                setPrivacy(privacyRes.data);
            } catch (err) {
                console.error('Failed to fetch terms:', err);
                setError('약관을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchTerms();
    }, []);

    /**
     * Handle individual checkbox change
     */
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setAgreements(prev => ({ ...prev, [name]: checked }));
    };

    /**
     * Check if required agreements are checked
     */
    const isRequiredAgreed = () => {
        return agreements.serviceTerms && agreements.privacyPolicy;
    };

    /**
     * Handle next button click
     */
    const handleNext = () => {
        if (!isRequiredAgreed()) {
            alert('필수 약관에 모두 동의해주세요.');
            return;
        }

        navigate('/signup');
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="약관을 불러오는 중..." />;
    }

    if (error) {
        return (
            <div className="agreement-page-wrapper">
                <div className="agreement-container">
                    <Alert variant="danger">{error}</Alert>
                    <Button onClick={() => navigate('/login')}>로그인 페이지로 돌아가기</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="agreement-page-wrapper">
            <div className="agreement-container">
                {/* Header Logo or Title if needed */}
                
                {/* Service Terms */}
                <div className="terms-section">
                    <h2 className="agreement-title">서비스 이용약관 동의</h2>
                    <div
                        className="terms-box"
                        dangerouslySetInnerHTML={{ __html: terms }}
                    />
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="agreeServiceTerms"
                            name="serviceTerms"
                            checked={agreements.serviceTerms}
                            onChange={handleCheckboxChange}
                            className="agreement-check-input"
                        />
                        <label htmlFor="agreeServiceTerms">
                            서비스 이용약관에 동의합니다.
                        </label>
                    </div>
                </div>

                {/* Privacy Policy */}
                <div className="terms-section">
                    <h2 className="agreement-title">개인정보 처리방침 동의</h2>
                    <div
                        className="terms-box"
                        dangerouslySetInnerHTML={{ __html: privacy }}
                    />
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="agreePrivacyPolicy"
                            name="privacyPolicy"
                            checked={agreements.privacyPolicy}
                            onChange={handleCheckboxChange}
                            className="agreement-check-input"
                        />
                        <label htmlFor="agreePrivacyPolicy">
                            개인정보 수집 및 이용에 동의합니다.
                        </label>
                    </div>
                </div>

                {/* Buttons */}
                <div>
                    <button
                        className="btn-next"
                        onClick={handleNext}
                        disabled={!isRequiredAgreed()}
                    >
                        다음
                    </button>
                    <button
                        className="btn-cancel"
                        onClick={() => navigate('/login')}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgreementPage;
