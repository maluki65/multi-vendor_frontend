import React from 'react';
import './SignSwipperItems.css';

function SignSwipperItems({signItem}) {
  return (
    <div className='bg-transparent p-3 flex flex-col gap-2 space-y-2'>
      <p className='text-white text-sm text-left signP'>{signItem.title}</p>
      <h1 className='text-white text-left signH1'>{signItem.text}</h1>
    </div>
  )
}

export default SignSwipperItems