/**
 * LoadingSpinner - Reusable loading spinner component
 *
 * Displays a loading spinner with optional message.
 * Supports different sizes and fullscreen overlay mode.
 */

import React from 'react';
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

const LoadingSpinner = ({
    size = 'md',
    message = '',
    fullScreen = false,
    variant = 'primary'
}) => {
    // Size mapping
    const sizeMap = {
        sm: { width: '1.5rem', height: '1.5rem' },
        md: { width: '3rem', height: '3rem' },
        lg: { width: '5rem', height: '5rem' }
    };

    const spinnerSize = sizeMap[size] || sizeMap.md;

    // Spinner element
    const spinner = (
        <div className="text-center">
            <Spinner
                animation="border"
                variant={variant}
                role="status"
                style={spinnerSize}
                aria-label="Loading"
            >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            {message && <p className="mt-3 text-muted">{message}</p>}
        </div>
    );

    // Full screen mode
    if (fullScreen) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    flexDirection: 'column'
                }}
            >
                {spinner}
            </div>
        );
    }

    // Inline mode
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                flexDirection: 'column'
            }}
        >
            {spinner}
        </div>
    );
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    message: PropTypes.string,
    fullScreen: PropTypes.bool,
    variant: PropTypes.string
};

export default LoadingSpinner;
