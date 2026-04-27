import React from 'react'
import '../BuyerTabs.css';
import { FiCheckCircle } from "react-icons/fi";
import { cartB1, cartB2, cartB3, cartB4, cartB5, cartB6 } from '../../../assets';
import { Inner } from '../../../commons';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AdLoader } from '../../';
import useCheckout from '../../../Hooks/useCheckout';

function Checkout() {

  const { getAllCheckoutSessions } = useCheckout();
  const { data: sessions, isLoading, isError } = getAllCheckoutSessions;

  //console.log('all sessions:', sessions);
  const navigate = useNavigate();

  const formatDate = (date) => {
    const day = date.getDate();
    const year = date.getFullYear();

    const month = date.toLocaleString('en-US', { month: 'long'});

    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10 ) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinal(day)} ${month} ${year}`;
  };

  const formatDateTime = (date) => {
    const formattedDate = formatDate(date);

    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} • ${formattedTime}`;
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'processing':
        return 'bg-blue-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };
  
  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'active':
        return 'bg-blue-500 text-white';
      case 'expired':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };


  if (isLoading) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white/90 z-50'>
        <AdLoader />
      </div>
    );
  }

  return (
    <Inner>
      <Toaster position='top-right' reverseOrder={false} />

      <section className='min-h-[30vh] flex flex-col justify-center items-center overflow-hidden'
        style={{
          backgroundImage: `url(${cartB4})`,
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
                / Checkout Sessions
              </a>
          </span>
      </section>

      {isError && (
        <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
          <FiCheckCircle className='text-red-500' size={55} />
          <p className='text-red-500'>Failed to load checkout sessions</p>
        </div>
      )}

      {!isError &&(
        sessions.length > 0 ? (
          <section className='min-h-[50vh] flex flex-col gap-2 px-[2%] py-5 overflow-hidden bg-gray-100'>
            <div className='grid grid-cols-3 gap-1 justigy-center items-center cartSessions'>
            {sessions.map((item) => (
              <div 
              key={item._id}
              onClick={() => navigate(`/buyer/checkout/${item._id}`)}
              className='bg-white rounded-md p-2 flex flex-col gap-2 cursor-pointer shadow-md hover:border hover:border-primary'>
                <h4 className='flex items-center gap-1 font-semibold text-dark'>CreatedAt: <span className='font-medium text-green-500'>{formatDateTime(new Date(item.createdAt))}</span></h4>
                
                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-dark'>Payment Status:</p>
                  <p className={`px-2 py-1 rounded-full text-sm ${getPaymentStatusColor(item.paymentStatus)}`}>
                    {item.paymentStatus}
                  </p>
                </div>

                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-dark'>Status:</p>
                  <p className={`px-2 py-1 rounded-full text-sm ${getOrderStatusColor(item.status)}`}>
                    {item.status}
                  </p>
                </div>

                <h4 className='flex items-center gap-1 font-semibold text-dark'>ExpiresAt: <span className='font-medium text-red-500 text-sm'>{formatDateTime(new Date(item.expiresAt))}</span></h4>

                <div className='flex flex-col gap-2'>
                  <h3 className='font-semibold text-gray-600'>Order Summary</h3>
                  <div className='flex flex-col gap-2 p-2'>
                    <div className='flex items-center justify-between'>
                      <p className='text-base font-semibold text-gray-700'>
                        Shipping:
                      </p>
                      <p className='text-sm font-medium text-gray-500'>
                        {(item.pricing.shipping / 100).toLocaleString()}
                      </p>
                    </div>
                    <div className='flex items-center justify-between'>
                      <p className='text-base font-semibold text-gray-700'>
                        Tax(16%):
                      </p>
                      <p className='text-sm font-medium text-gray-500'>
                        {(item.pricing.tax / 100).toLocaleString()}
                      </p>
                    </div>
                    <div className='flex items-center justify-between'>
                      <p className='text-base font-semibold text-gray-700'>
                        Subtotal:
                      </p>
                      <p className='text-sm font-medium text-gray-500'>
                        {(item.pricing.subtotal/ 100).toLocaleString()}
                      </p>
                    </div> 

                    <hr className='flex-1 border-t border-gray-300' />

                    <div className='flex items-center justify-between'>
                      <p className='text-base font-semibold text-gray-700'>
                        Total:
                      </p>
                      <p className='text-sm font-semibold text-gray-800'>
                        {(item.pricing.total / 100).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </section>
        ) : (
          <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
            <FiCheckCircle className='text-red-500' size={55} />
            <p className='text-red-500'>Checkout session expired or not found</p>
          </div>
        )
      )}
      
    </Inner>
  )
}

export default Checkout