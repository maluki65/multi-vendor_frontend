import React from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import { cartB1, cartB2, cartB3, cartB4, cartB5, cartB6, cartB7, cartB8, cartB9, detail } from '../../../assets';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Account() {
  const navigate = useNavigate();

  return (
    <Inner>
      <Toaster position='top-right' reverseOrder={false} />
      <section className='min-h-[30vh] flex flex-col justify-center items-center overflow-hidden'
        style={{
          backgroundImage: `url(${detail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <h1 className='font-semibold text-4xl text-dark leading-relaxed PathName'>
            My Account
          </h1>
          <span className='flex items-center gap-1'>
            <a
              onClick={() => navigate('/buyer/products')}
              className='text-gray-700 hover:text-primary cursor-pointer path'>
                Home
              </a>
              <a 
               className='text-gray-700 path'>
                / My Account
              </a>
          </span>
      </section>
    </Inner>
  )
}

export default Account