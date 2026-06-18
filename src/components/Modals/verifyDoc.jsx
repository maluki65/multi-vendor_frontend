import React from 'react';
import './VerifyDoc.css';
import { RiCloseCircleLine } from "react-icons/ri";

function VerifyDoc({ isOpen, onClose, title, children, className = '' }) {
  if(!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0 bg-black/50 z-40 backdrop-blur-sm'
        onClick={onClose}
      />

      <div className='fixed inset-0 flex items-center justify-center z-50 overflow-y-auto'>
        <div className={`bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6 relative modalCon ${className}`}>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-medium modalT'>
             {title}
            </h2>
            <button 
              onClick={onClose}
              >
                <RiCloseCircleLine
                  size={28}
                  className='text-red-600 cursor-pointer'
                />
            </button>
          </div>
          <div className='modal-body'>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyDoc