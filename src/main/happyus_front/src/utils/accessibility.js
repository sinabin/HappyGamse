/**
 * Accessibility utilities for HappyGamse
 *
 * Provides helper functions to improve WCAG 2.1 AA compliance
 */

/**
 * Announce to screen readers using ARIA live region
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' (default) or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;

        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
};

/**
 * Set focus to element with optional delay
 * @param {string|HTMLElement} element - Element or selector
 * @param {number} delay - Delay in milliseconds
 */
export const setFocus = (element, delay = 0) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;

    if (el) {
        setTimeout(() => {
            el.focus();
        }, delay);
    }
};

/**
 * Trap focus within a container (for modals)
 * @param {HTMLElement} container - Container element
 * @returns {Function} Cleanup function
 */
export const trapFocus = (container) => {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    container.addEventListener('keydown', handleTabKey);

    // Return cleanup function
    return () => {
        container.removeEventListener('keydown', handleTabKey);
    };
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get skip link navigation
 * @returns {JSX.Element}
 */
export const SkipLink = ({ targetId = 'main-content', text = '본문으로 건너뛰기' }) => {
    const handleClick = (e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            href={`#${targetId}`}
            onClick={handleClick}
            style={{
                position: 'absolute',
                left: '-9999px',
                top: 'auto',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                zIndex: 999999,
                backgroundColor: '#000',
                color: '#fff',
                padding: '10px 20px',
                textDecoration: 'none'
            }}
            onFocus={(e) => {
                e.target.style.left = '0';
                e.target.style.width = 'auto';
                e.target.style.height = 'auto';
            }}
            onBlur={(e) => {
                e.target.style.left = '-9999px';
                e.target.style.width = '1px';
                e.target.style.height = '1px';
            }}
        >
            {text}
        </a>
    );
};

/**
 * Create ARIA live region for announcements
 * Should be added to root App component
 */
export const AriaLiveRegion = () => {
    return (
        <div
            id="aria-live-region"
            aria-live="polite"
            aria-atomic="true"
            style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden'
            }}
        />
    );
};

/**
 * Keyboard navigation helper for custom components
 * @param {KeyboardEvent} e - Keyboard event
 * @param {Object} handlers - Key handlers {Enter: fn, Escape: fn, etc}
 */
export const handleKeyPress = (e, handlers) => {
    const handler = handlers[e.key];
    if (handler) {
        e.preventDefault();
        handler(e);
    }
};

/**
 * Generate unique ID for form field associations
 * @param {string} prefix - ID prefix
 * @returns {string}
 */
let idCounter = 0;
export const generateId = (prefix = 'field') => {
    return `${prefix}-${++idCounter}`;
};

export default {
    announceToScreenReader,
    setFocus,
    trapFocus,
    prefersReducedMotion,
    SkipLink,
    AriaLiveRegion,
    handleKeyPress,
    generateId
};
