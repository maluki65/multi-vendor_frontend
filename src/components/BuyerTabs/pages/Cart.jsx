import React from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import useCart from '../../../Hooks/useCart';
import { Toaster } from 'react-hot-toast';
import { cartB1, cartB2 } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import { CartTable } from '../../';

function Cart() {

  const { cart, updateQuantity, removeFromCart, clearCart, isLoading, isError } = useCart();
  const navigate = useNavigate();

  //console.log('Cart items:', cart);

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
      
      <section className='min-h-[40vh] px-[2%] my-5 overflow-hidden'>
        <div className='grid grid-cols-[70%_30%] gap-2'>
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
        </div>
      </section>


    </Inner>
  )
}

export default Cart