import React from 'react';

const ConfirmationDialog = ({ onDelete, onPerformOCR, onClose }) => {
  return (
    <div className="confirmation-dialog">
      <div className="confirmation-dialog-content">
        <h4>What would you like to do?</h4>
        <button onClick={onDelete} className="btn btn-danger">
          Delete Image
        </button>
        <button onClick={onPerformOCR} className="btn btn-primary">
          Perform OCR
        </button>
        <button onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
