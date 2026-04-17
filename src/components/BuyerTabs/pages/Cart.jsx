import React, { useState } from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import useCart from '../../../Hooks/useCart';
import { Toaster } from 'react-hot-toast';
import { cartB1, cartB2 } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import { CartTable, LocationSelector, OrderSummary } from '../../';
import { Api } from '../../../utils';

function Cart() {
  const [location, setLocation] = useState(null);  

  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    pricing,  
    totalItems, 
    isLoading, 
    isError 
  } = useCart(location);

  const navigate = useNavigate();

  //console.log('Cart items:', cart);

  const appyLocation = (loc) => {
    setLocation(loc);
  }
  const canCheckOut = location && pricing;

  return (
    <Inner>
      <Toaster position='top-right' reverseOrder={false} />
      <section className='min-h-[30vh] flex flex-col justify-center items-center overflow-hidden'
        style={{
          backgroundImage: `url(${cartB1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
          <h1 className='font-semibold text-4xl text-dark leading-relaxed PathName'>
            Shopping Cart
          </h1>
          <span className='flex items-center gap-1'>
            <a 
             onClick={() => navigate('/buyer/products')}
             className='text-gray-700 hover:text-primary cursor-pointer path'>
              Home
            </a>
            <a className='text-gray-700 path'>
             / shopping cart
            </a>
          </span>
      </section>
      
      <section className='min-h-[40vh] px-[2%] my-5'>
        <div className='grid grid-cols-[75%_25%] gap-2 cartConGrid'>
          <div className='flex flex-col gap-4'>
            <CartTable 
              cart={cart} 
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              isLoading={isLoading}
              isError={isError}
            />

            <div className='flex justify-between items-center'>
              <p className=''>Appy coupon</p>
              <p 
                onClick={() => clearCart.mutate()}
                className='text-primary text-ms underline cursor-pointer font-semibold'>
                  Clear shopping cart
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-4 my-7'>
            <LocationSelector
              location={location}
              setLocation={appyLocation}
            />

            <OrderSummary
              pricing={pricing}
              totalItems={totalItems}
              canCheckOut={canCheckOut}
            />

            {!location && (
              <p className='text-sm text-red-500'>
                Select delivery location to continue
              </p>
            )}
          </div>
        </div>
      </section>


    </Inner>
  )
}

export default Cart