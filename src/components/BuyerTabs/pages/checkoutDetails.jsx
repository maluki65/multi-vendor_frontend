import React, { useState } from 'react';
import '../BuyerTabs.css';
import { useParams } from 'react-router-dom';
import useCheckout from '../../../Hooks/useCheckout';
import { AdLoader } from '../../';
import { FiCheckCircle } from "react-icons/fi";
import { cartB1, cartB2 } from '../../../assets';
import { Inner } from '../../../commons';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PiMoneyWavyLight } from "react-icons/pi";
import { CiCreditCard1 } from "react-icons/ci";

const ShippingPaymentInfo ={
  firstName: '',
  lastName: '',
  phone: '',
  mpesaPhone: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
}

function CheckoutDetails() {
  const [form, setForm] = useState(ShippingPaymentInfo);
  const [activeTab, setActiveTab] = useState('M-pesa');

  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { checkoutSessionQuery } = useCheckout(sessionId);

  const { data: session, isLoading, isError } = checkoutSessionQuery;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, [name]: value 
    }));
  }

  const paymentMethods = [
    { name: 'M-pesa', value: 'M-pesa', icon: PiMoneyWavyLight },
    { name: 'Card', value: 'Card', icon: CiCreditCard1 }
  ]
  console.log('checkout session:', session);

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

      {isLoading ? (
        <div className='fixed inset-0 flex items-center justify-center bg-white/90 z-50'>
          <AdLoader />
        </div>
      ) : isError ? (
        <div className='text-center text-gray-500 flex flex-col items-center gap-2 my-5'>
        <FiCheckCircle className='text-red-500' size={55} />
          <p className='text-red-500'>Failed to load checkout session</p>
        </div>
      ): session ? (
        <div className='my-5 px-[2%] p-2'>
          <div className='grid grid-cols-[70%_30%] gap-4 checkSession'>
            <div className='p-2 flex flex-col gap-5'>
              <div className='flex flex-col gap-3 border-[1.5px] border-gray-200 rounded-md  p-4'>
                <div className='grid grid-cols-2 items-center gap-2 cardMpesaIn'>
                  <div className='flex flex-col gap-1'>
                    <label className='flex items-center text-sm font-semibold gap-1 text-dark'>FirstName <span className='font-bold text-dark'>*</span></label>
                    <input 
                      type='text'
                      name='firstName'
                      required
                      placeholder='Enter first name'
                      value={form.firstName}
                      onChange={handleChange}
                      className='p-2 outline-none border-[1.3px] border-gray-300 w-full focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg'
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='flex items-center text-sm font-semibold gap-1 text-dark'>LastName <span className='font-bold text-dark'>*</span></label>
                    <input 
                      type='text'
                      name='lastName'
                      required
                      placeholder='Enter last name'
                      value={form.lastName}
                      onChange={handleChange}
                      className='p-2 outline-none border-[1.3px] border-gray-300 focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg'
                    />
                  </div>
                </div>

                <div className='flex flex-col'>
                  <label className='flex items-center text-sm font-semibold gap-1 text-dark'>Contact phone <span className='font-bold text-dark'>*</span></label>
                  <input 
                    type='number'
                    name='phone'
                    required
                    placeholder='Enter phone number'
                    value={form.phone}
                    onChange={handleChange}
                    className='p-2 outline-none border-[1.3px] border-gray-300 focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg'
                  />
                </div>
                  
              </div>

              <div className='p-2 flex flex-col gap-3 border-[1.5px] border-gray-200 rounded-md'>
                <div className='p-2 flex gap-3 '>
                  {paymentMethods.map((item, index) => {
                    const Icon = item.icon

                    return (
                      <div
                        key={index}
                        onClick={() => setActiveTab(item.value)}
                        className={`flex-1 flex flex-col border-[1.5px] text-gray-500 border-gray-300  justify-center cursor-pointer items-center px-4 py-2 rounded ${activeTab === item.value ? 'border-primary text-primary' : ''}`}
                        >
                          <Icon size={25} />
                          <p className='text-base'>{item.name}</p>
                      </div>
                    )
                  })}     
                </div>
                <div className='p-2 my-2'>
                  <AnimatePresence mode='wait'>
                    {activeTab === 'M-pesa' && (
                      <motion.div
                        key='M-pesa'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className='flex flex-col gap-2'
                        >
                          <div className='flex flex-col gap-1'>
                            <label className='flex items-center text-sm font-semibold gap-1 text-dark'>Enter phone no for prompt <span className='font-bold text-dark'>*</span></label>
                            <input 
                              type='number'
                              name='mpesaPhone'
                              required
                              placeholder='Enter number'
                              value={form.mpesaPhone}
                              onChange={handleChange}
                              className='p-2 outline-none border-[1.3px] border-gray-300 w-full focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg'
                            />
                          </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode='wait'>
                    {activeTab === 'Card' && (
                      <motion.div
                        key='Card'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className='flex flex-col gap-2'
                        >
                          <div className='flex flex-col gap-3'>
                            <div className='flex flex-col gap-1'>
                              <label className='flex items-center text-sm font-semibold gap-1 text-dark'>Card Holder Name <span className='font-bold text-dark'>*</span></label>
                              <input 
                                type='number'
                                name='mpesaPhone'
                                required
                                placeholder="Enter card holder's name"
                                value={form.mpesaPhone}
                                onChange={handleChange}
                                className='p-2 outline-none border-[1.3px] border-gray-300 w-full focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg'
                              />
                            </div>

                            <div className='flex flex-col gap-1'>
                              <label className='flex items-center text-sm font-semibold gap-1 text-dark'>Card Number <span className='font-bold text-dark'>*</span></label>
                              <input 
                                type='number'
                                name='cardNumber'
                                required
                                placeholder='Enter card number'
                                value={form.cardNumber}
                                onChange={handleChange}
                                className='p-2 outline-none border-[1.3px] border-gray-300 w-full focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg'
                              />
                            </div>

                            <div className='grid grid-cols-2 items-center gap-2 cardMpesaIn'>
                              <div className='flex flex-col gap-1'>
                                <label className='flex items-center text-sm font-semibold gap-1 text-dark'>Expiry Date <span className='font-bold text-dark'>*</span></label>
                                <input 
                                  type='text'
                                  name='expiryDate'
                                  required
                                  placeholder='02/30'
                                  value={form.expiryDate}
                                  onChange={handleChange}
                                  className='p-2 outline-none border-[1.3px] border-gray-300 w-full focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg'
                                />
                              </div>
                              <div className='flex flex-col gap-1'>
                                <label className='flex items-center text-sm font-semibold gap-1 text-dark'>CVV <span className='font-bold text-dark'>*</span></label>
                                <input 
                                  type='text'
                                  name='cvv'
                                  required
                                  placeholder='000'
                                  value={form.cvv}
                                  onChange={handleChange}
                                  className='p-2 outline-none border-[1.3px] border-gray-300 focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg'
                                />
                              </div>
                            </div>

                            <div className='flex gap-2'>
                              <input 
                                type='checkbox'
                                name='saveDetails'
                                value={form.saveDetails}
                                onChange={handleChange}
                              />
                              <label className='flex items-center text-sm font-medium text-gray-600'>Save card details for future payments</label>
                            </div>
                          </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            <div className='p-2'>
              <div className='border-[1.5px] border-gray-200 p-4 rounded-md space-y-3 orderSummary'>
                <h3 className='font-semibold text-dark'>Order summary</h3>

                <hr className='flex-1 border-t border-gray-300' />

                <div className='flex justify-between'>
                  <span className='text-muted'>Items</span>
                  <span className='font-semibold'>{session.items.length}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-muted'>Subtotal</span>
                  <span className='font-semibold'>Ksh {(session.pricing.subtotal / 100).toLocaleString()}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-muted'>VAT (16%)</span>
                  <span className='font-semibold'> Ksh {(session.pricing.tax / 100).toLocaleString()}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-muted'>Shipping</span>
                  <span className='font-semibold'>Ksh {(session.pricing.shipping / 100).toLocaleString()}</span>
                </div>

                <hr className='flex-1 border-t border-gray-300' />

                <div className='flex justify-between'>
                  <span className='text-muted'>Total</span>
                  <span className='font-semibold'>Ksh {(session.pricing.total / 100).toLocaleString()}</span>
                </div>

                <button
                  className={`w-full my-3 py-3 rounded-full text-white cursor-pointer bg-dark`}
                  >
                  {isLoading ? 'Processing...' : ' Pay Now' }
                </button>
              </div> 
            </div>
          </div>
        </div>
      ) : (
        <div className='text-center text-gray-500 flex flex-col items-center gap-2 my-5'>
        <FiCheckCircle className='text-red-500' size={55} />
          <p className='text-red-500'>Checkout session expired or not found</p>
        </div>
      )}
    </Inner>
  );
}

export default CheckoutDetails;