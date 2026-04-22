import React from 'react';
import '../BuyerTabs.css';
import { useParams } from 'react-router-dom';
import useCheckout from '../../../Hooks/useCheckout';
import { AdLoader } from '../../';
import { FiCheckCircle } from "react-icons/fi";
import { cartB1, cartB2 } from '../../../assets';
import { Inner } from '../../../commons';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function CheckoutDetails() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { checkoutSessionQuery } = useCheckout(sessionId);

  const { data: session, isLoading, isError } = checkoutSessionQuery;

  console.log('checkout session:', session);

  if (isLoading) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white/90 z-50'>
        <AdLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
        <FiCheckCircle className='text-red-500' size={55} />
        <p className='text-red-500'>Failed to load checkout session</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
        <FiCheckCircle className='text-red-500' size={55} />
        <p className='text-red-500'>Checkout session expired or not found</p>
      </div>
    );
  }

  return (
    <Inner>
      <Toaster position='top-right' reverseOrder={false} />
      <section className='min-h-[30vh] flex flex-col justify-center items-center overflow-hidden'
        style={{
          backgroundImage: `url(${cartB2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <h1 className='font-semibold text-4xl text-dark leading-relaxed PathName'>
            Checkout Session
          </h1>
          <span className='flex items-center gap-1'>
            <a
              onClick={() => navigate('/buyer/products')}
              className='text-gray-700 hover:text-primary cursor-pointer path'>
                Home
              </a>
              <a 
               onClick={() => navigate('/buyer/cart')}
               className='text-gray-700 path'>
                / shopping cart
              </a>
              <a className='text-gray-700 path'>
                / Checkout
              </a>
          </span>
      </section>
    </Inner>
  );
}

export default CheckoutDetails;