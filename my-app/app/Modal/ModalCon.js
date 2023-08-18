import React from 'react';

const ModalCon = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">
          Close
        </button>
        <p>This is the modal content.</p>
      </div>
    </div>
  );
};

export default ModalCon;
