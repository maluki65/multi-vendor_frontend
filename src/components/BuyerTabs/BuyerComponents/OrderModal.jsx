import React, { useEffect, useRef } from 'react';
import { RiCloseCircleLine } from "react-icons/ri";
import { motion, AnimatePresence } from 'framer-motion';
import { FiPrinter } from "react-icons/fi";
import { FaCheckCircle, FaCircle, FaBox, FaTruck, FaHome, FaTimesCircle } from "react-icons/fa";
import { addDays, format } from 'date-fns';
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { useReactToPrint } from 'react-to-print';

function OrderModal({ isOpen, onClose, order, onTrack, onInvoice, type }) {

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Order-${order?.orderNumber}`,
  });

  if (!isOpen || !order) return null;

  const estimatedDate = addDays(new Date(order?.createdAt), 3);
  const estimated = format(estimatedDate, 'dd MMM yyyy . h:mm a');
  const isOverdue = estimatedDate < new Date() && !order?.completedAt;

  const step = order?.orderStatus === 'pending' ? 1 
    : order?.orderStatus === 'shipped' ? 2
    : order?.orderStatus === 'completed' ? 3
    : 0;

  const cancelled = order?.orderStatus === 'cancelled';

  const steps = [
    {
      title: 'Ordered',
      date: order?.createdAt,
      description: 'You order has been received',
      icon: <FaBox />,
    },
    {
      title: 'Confirmed',
      date: order?.processingAt || order?.createdAt,
      description: "Your order has been confirmed and is being prepared.",
      icon: <FaCheckCircle />,
    },
    {
      title: 'Shipped',
      date: order?.shippedAt,
      description: 'You order is on the way',
      icon: <FaTruck />,
    },
    {
      title: 'Delivered',
      date: order.completedAt || estimatedDate,
      description: order.completedAt
      ? 'Order delivered'
      : 'Expected delivery',
      icon: <FaHome/>,
    },
  ];
 
  return (
    <div 
      onClick={onClose}
      className='fixed inset-0 z-9945 flex items-center justify-center bg-black/50 overflow-y-auto overflow-x-hidden backdrop-blur-sm'>
      <AnimatePresence mode='wait'>
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className='bg-gray-100 rounded-2xl w-full max-w-xl p-6 shadow-xl m-2 orderTrackingWhite'>
          <div className='flex justify-end items-center mb-2'>
            {/*<h2 className='font-semibold text-lg capitalize'>
              {type} Order
            </h2>*/}
            <button onClick={onClose}>
              <RiCloseCircleLine
                size={28}
                className='text-red-600 cursor-pointer trackingIcon'
              />
            </button>
          </div>
          {cancelled ? (
            <div className=' p-6'>
              <div className='flex flex-col items-center gap-3 text-red-500'>
                <MdOutlineRemoveShoppingCart size={50} />
                <h3 className='font-semibold text-lg'>
                  Order Cancelled
                </h3>
                <p className='text-sm text-gray-500'>
                  {order?.cancelledAt ? format(new Date(order?.cancelledAt), 'dd MMM yyyy . h:mm a') : '--'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {type === 'track' && (
                <div 
                  ref={printRef}
                  className='h-[70vh] overflow-y-auto flex flex-col space-y-2 px-2'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <h1 className='font-semibold text-dark text-center text-lg trackingTitle'>Track Your Order</h1>
                    <p className='text-gray-500 text-sm'>Stay updated on your order's delivery status in real time.</p>
                  </div>
                  <div className='bg-white rounded-md p-4 flex flex-col gap-1 border-[1.5px] border-gray-300'>
                    <div className='flex items-center justify-between TrackOrderNumbers'>
                      <p className='text-dark font-semibold flex items-center gap-2'>
                        Order {order?.orderNumber}
                        <span className='p-1 rounded font-normal bg-orange-500 text-white text-sm'>
                          {order?.orderStatus}
                        </span>
                      </p>
                      <button
                        onClick={handlePrint}
                        className='p-1 border-[1.4px] border-gray-400 flex gap-2 items-center text-dark cursor-pointer rounded font-semibold text-sm hover:text-primary hover:border-primary TrackOrderPrinter no-print'>
                          <FiPrinter className='' size={20} />
                          Print
                      </button>
                    </div>
                    <p className='text-gray-500 text-sm font-medium'>
                    Placed on {new Date(order?.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year:'numeric',
                    })}
                    </p>
                  </div>
                  <div className='bg-white rounded-md p-5 flex flex-col shadow-sm gap-1 border-[1.5px] border-gray-300 no-print'>
                    <div className='mb-8'>
                      <h3 className='font-semibold text-md'>
                        Delivery Progress
                      </h3>

                      <p
                        className={`text-sm ${
                          isOverdue ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        {order?.completedAt ? "Order delivered:" : "Expected delivery:"}{" "}
                        <span className="font-medium">
                          {order?.completedAt
                            ? format(new Date(order.completedAt), "dd MMM yyyy")
                            : estimated}
                        </span>
                      </p>
                    </div>

                    <div className='relative TrackorizontalLine'>
                      <div className='absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full'>
                        <div className='h-full bg-dark rounded-full transition-all duration-500'
                        style={{
                          width:
                            step === 0
                            ? '0%'
                            : step === 1
                            ? '33%'
                            : step === 2
                            ? '66%'
                            : '100%',
                        }}/>
                      </div>

                      <div className='grid grid-cols-4 relative '>
                        {steps.map((item, index) => (
                          <div 
                            key={item.title}
                            className='flex flex-col items-center'
                            >
                              <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center transition ${
                              index <= step
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                              }`}
                                >
                                  {item.icon}
                              </div>
                              <span className='mt-3 font-medium text-center text-sm'>
                                {item.title}
                              </span>
                              <span className='text-xs text-gray-500'>
                                {item.date ? format(new Date(item.date), 'dd MMM ') : '--'}
                              </span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/*On small screen*/}
                    <div className='TrackVeriticalLine'>
                      {steps.map((item, index) => (
                        <div
                          key={item.title}
                          className='flex items-start ga-4 pb-6'
                          >
                            <div className="flex flex-col items-center mr-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  index <= step
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {item.icon}
                              </div>

                              {index !== steps.length - 1 && (
                                <div
                                  className={`w-0.5 h-12 ${
                                    index < step
                                      ? 'bg-green-500'
                                      : 'bg-gray-300'
                                  }`}
                                />
                              )}
                            </div>

                            <div className=''>
                              <div className='flex items-center gap-2'>
                                <p className='font-medium'>
                                  {item.title}
                                </p>
                                {index === step && (
                                  <span className='text-xs bg-orange-300 text-orange-600 px-2 py-0.5 rounded-full font-medium'>current</span>
                                )}
                              </div>
                              <p className='text-sm text-gray-500'>
                                {item.description}
                              </p>
                              <p className='text-sm text-gray-500'>
                                {item.date ? format(new Date(item.date), 'dd MMM yyyy . h:mm a') : '--'}
                              </p>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='bg-white rounded-md p-5 flex flex-col gap-2 shadow-sm border-[1.5px] border-gray-300'>
                    <h1 className='font-semibold text-md'>
                      Order Items
                    </h1>
                    <div className='flex flex-col gap-2'>
                      {order?.products.map((product) => {
                        return (
                          <>
                            <div 
                              key={product?._id}
                              className='flex items-center justify-between orderProductModal'
                              >
                                <div className='flex items-center gap-2'>
                                  <img
                                    src={product?.image}
                                    alt={product?.name}
                                    className='h-15 w-17 rounded-md object-contain no-print'
                                    loading='lazy'
                                  />
                                  <div className='flex flex-col gap-1'>
                                    <h3 className='text-dark font-semibold'>
                                      {product?.name}
                                    </h3>
                                    <p className='text-gray-500 text-sm'>
                                      Qty: {product?.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex flex-col gap-2 items-end productOrderPrice'>
                                  <h3 className='text-dark font-semibold'>
                                    ksh{(product?.price / 100).toLocaleString()}
                                  </h3>
                                  <p className='text-gray-500 text-xs'>
                                  ksh {(product?.price / 100).toLocaleString()} total
                                  </p>
                                </div>
                            </div>
                            <hr className='flex-1 border-t border-gray-300' />                            
                          </>
                        )
                      })}
                    </div>
                    <div className='my-1 flex items-center justify-between'>
                      <p className='text-sm text-gray-500'>{order?.productCount} item(s)</p>
                      <p className='text-sm text-gray-500'>Total: ksh{(order?.totalAmount / 100).toLocaleString()}</p>
                    </div>
                  </div>

                  {/*}<div className='grid grid-cols-2 gap-2'>
                    <div className='bg-white rounded-md px-3 py-2 flex flex-col gap-2 border-[1.5px] border-gray-300'>
                      <h4 className='font-semibold flex items-center gap-1'>
                        <IoLocationOutline className='' size={18}/>
                        Shipping Address
                      </h4>
                    </div>
                  </div>*/}
                  <div className='bg-white rounded-md p-5 flex flex-col gap-2 shadow-sm border-[1.5px] border-gray-300 justify-center items-center mb-2 no-print'>
                    <h2 className='font-semibold text-dark text-md text-center'>
                      Need Help with Your Order?
                    </h2>
                    <p className='text-sm text-gray-500 text-center'>
                      Our support team is here to help you with any questions
                    </p>
                    <div className='flex gap-2 items-center orderSupport'>
                      <button 
                        className='px-4 py-2 rounded-md text-dark font-semibold border-[1.4px] border-gray-400 hover:bg-gray-200 cursor-pointer'>
                          Contact Support
                      </button>
                      <button 
                        onClick={onClose}
                        className='px-4 py-2 rounded-md text-dark font-semibold border-[1.4px] border-gray-400 hover:bg-gray-200 cursor-pointer'>
                          View Order Details
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {type === 'invoice' && (
                <div className=''>Invoice</div>
              )}
            </>
          )}          
        </motion.div>
      </AnimatePresence>
      
    </div>
  );
}

export default OrderModal