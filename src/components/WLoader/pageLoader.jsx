import React from 'react';
import './PageLoader.css';

function PageLoader() {
  return (
    <div className='absolute inset-0 flex items-center justify-center bg-white/60 z-10'>
      <div className="PageSpinner"></div>
    </div>
  )
}

export default PageLoader