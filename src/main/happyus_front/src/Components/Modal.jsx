import React from 'react';
import './Modal.css';

function Modal({ show, title, children, onClose }) {
    return show && (
        <div className="channel-modal-background">
            <div className="channel-modal-content">
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
}

export default Modal;
