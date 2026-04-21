import React from 'react';
import { useParams } from 'react-router-dom';
import useCheckout from '../../../Hooks/useCheckout';
import { AdLoader } from '../../';
import { FiCheckCircle } from "react-icons/fi";

function Checkout() {
  const { sessionId } = useParams();

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
    <div>
      checkout
    </div>
  );
}

export default Checkout;