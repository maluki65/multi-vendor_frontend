import React, { useState, useEffect, useRef } from 'react'
import '../BuyerTabs.css';
import { FiCheckCircle } from "react-icons/fi";
import { cartB1, cartB2, cartB3, cartB4, cartB5, cartB6 } from '../../../assets';
import { Inner } from '../../../commons';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AdLoader, Footer } from '../../';
import useCheckout from '../../../Hooks/useCheckout';
import { format } from 'date-fns';
import { BsThreeDots } from "react-icons/bs";

function Checkout() {
  const [openMenu, setOpenMenu] = useState(null);
  const [page, setPage] = useState(1);
  const menuRef = useRef(null);
  const limit = 10;

  const { getAllCheckoutSessions, resumeCheckout } = useCheckout();
  const { data, isLoading, isError } = getAllCheckoutSessions(page, limit);

  //console.log('all sessions:', sessions);
  const totalPages = data?.totalPages || 1;
  const sessions = data?.sessions || [];
  const navigate = useNavigate();

  const handleProceed = (sessionId) => {
    navigate(`/buyer/checkout/${sessionId}`);
    setOpenMenu(null);
  };

  const handleResume = (sessionId) => {
    resumeCheckout.mutate(sessionId);
    setOpenMenu(null);
  };


  const canResume = (item) => 
  (item.status === 'expired' && 
    ['pending', 'failed'].includes(item.paymentStatus)) || 
    (item.status === 'active' && item.paymentStatus === 'failed');

  const canProceed = (item) => 
    item.status === 'active' && item.paymentStatus === 'pending';

  const handleCardclick = (item) => {
    if (canProceed(item)) {
      navigate(`/buyer/checkout/${item._id}`);
      return;
    }

    if (canResume(item)) {
      toast.error(
        'This checkout has expired or failed. Please use resume checkout.'
      );
      return;
    }

    toast.error('This checkout session is no longer available.');
  };

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
        return 'bg-red-500 text-white';
      case 'cancelled':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          backgroundImage: `url(${cartB5})`,
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
      
      <section className='min-h-[50vh] flex flex-col gap-2 px-[2%] py-5 overflow-hidden bg-gray-100'>
        {!isError &&(
          sessions.length > 0 ? (
            <div className=''>
              <table className='w-full border-[1.4px] border-gray-300 border-separate border-spacing-0 rounded-lg overflow-x-auto mt-4 checkoutTable'>
                <thead className=''>
                  <tr className='bg-orange-400 text-left text-sm text-dark rounded-lg font-light'>
                    <th className='p-3 rounded-tl-lg'>Checkout ID</th>
                    <th className='p-3'>Shipping</th>
                    <th className='p-3'>Total</th>
                    <th className='p-3'>Status</th>
                    <th className='p-3'>Payment status</th>
                    <th className='p-3'>expiresAt</th>
                    <th className='p-3 rounded-tr-lg'></th>
                  </tr>
                </thead>
                <tbody className=''>
                  {sessions.map((item) => {
                    return (
                      <tr 
                        key={item?._id}
                        className='last:[&>td]:border-b-0 [&>td]:border-b-[1.2px] [&>td]:border-gray-300 text-gray-500 text-md'>
                          <td className='p-3'>
                            {item?.checkoutUUID}
                          </td>
                          <td className='p-3'>
                            {item?.shippingAddress.area}, {item?.shippingAddress.county} 
                          </td>
                          <td className='p-3'>ksh {(item?.pricing?.total / 100).toLocaleString()}</td>
                          <td className='p-3'>
                            <span className={`px-2 py-1 rounded-full text-sm ${getOrderStatusColor(item?.status)}`}>
                              {item?.status}
                            </span>
                          </td>
                          <td className='p-3'>
                            <span className={`px-2 py-1 rounded-full text-sm ${getPaymentStatusColor(item?.paymentStatus)}`}>
                              {item?.paymentStatus}
                            </span>
                          </td>
                          <td className='p-3'>
                            {format(new Date(item?.expiresAt), 'dd MMM yyyy')}
                          </td>
                          <td className='p-3 relative'>
                            <BsThreeDots 
                              onClick={() => setOpenMenu(openMenu === item._id ? null : item._id)}
                              className='cursor-pointer RevStarComm' 
                              size={20}
                            />

                            {openMenu === item._id && (
                              <div 
                              ref={menuRef}
                              className='absolute right-3 top-10 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50 p-2 flex flex-col gap-2'>
                                {canProceed(item) && (
                                  <button
                                    onClick={() => handleProceed(item._id)}
                                    className='w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium text-primary cursor-pointer'
                                    >
                                      Proceed to checkout
                                  </button>
                                )}

                                {canResume(item) && (
                                  <button
                                    onClick={() => handleResume(item._id)}
                                    className='w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium text-green-600 cursor-pointer'
                                    >
                                      Resume checkout
                                  </button>
                                )}

                                {!canProceed(item) && !canResume(item) && (
                                  <p className='px-3 py-2 text-sm text-gary-500'>
                                    No actions available
                                  </p>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* On small screens*/}
              <div className='grid grid-cols-3 gap-1 justigy-center items-center cartSessions'>
              {sessions.map((item) => (
                <div 
                key={item._id}
                onClick={() => handleCardclick(item)}
                className={`bg-white rounded-md p-2 flex flex-col gap-2 shadow-md transition-all ${
                  canProceed(item)
                    ? 'cursor-pointer hover:border hover:border-primary'
                    : 'cursor-not-allowed opacity-95'
                }`}>
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

                  {canResume(item) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResume(item._id);
                      }}
                      className='w-full mt-2 px-3 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 cursor-pointer'
                    >
                      Resume checkout
                    </button>
                  )}
                </div>
              ))}
              </div>
            </div>
          ) : (
            <div className='min-h-[60vh]  justify-center text-center text-gray-500 flex flex-col items-center gap-2'>
              <FiCheckCircle className='text-red-500' size={55} />
              <p className='text-red-500'>Checkout session expired or not found</p>
            </div>
          )
        )}
        <div className='flex justify-between items-center CatNav mt-4'>
          <button 
            disabled={page <= 1} 
            onClick={() => setPage(page - 1)}
            className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
              >
              Prev
          </button>
          <span className=''>
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(page + 1)}
            className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
            >
              Next
          </button>
        </div>
      </section>


      
      <div className='p-2'>
        <Footer />
      </div>
    </Inner>
  )
}

export default Checkout