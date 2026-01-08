import React from 'react';
import './loader.css';

function loader() {
  return (
    <div className='flex items-center justify-center'>
      <div className="spinner"></div>
    </div>
  )
}

export default loader