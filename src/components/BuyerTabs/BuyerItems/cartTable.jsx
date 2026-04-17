import React from 'react';
import '../BuyerTabs.css';
import { FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import { AdLoader } from '../../';
import { MdRemoveShoppingCart, MdError } from "react-icons/md";

function CartTable({ cart, updateQuantity, removeFromCart, isLoading, isError }) {

  const handleIncrease = (item) => {
    updateQuantity.mutate({
      productId: item.productId,
      quantity: item.quantity + 1,
    });
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return;
    updateQuantity.mutate({
      productId: item.productId,
      quantity: item.quantity - 1,
    });
  };

  const handleRemove = (id) => {
    removeFromCart.mutate(id);
  };

  return (
    <div className='w-full overflow-x-auto mt-10 p-2'>
      {isLoading ? (
        <div className='fixed inset-0 flex items-center justify-center bg-white/90 z-50'>
          <AdLoader/>
        </div>
      ) : (
        <table className='w-full border-collapse CartTable'>
          <thead className=''>
            <tr className='bg-secondary text-left text-sm font-medium text-dark rounded-lg'>
              <th className='p-3 rounded-l-lg'>Product</th>
              <th className='p-3'>Price</th>
              <th className='p-3'>Quantity</th>
              <th className='p-3 rounded-r-lg'>Subtotal</th>
            </tr>
          </thead>

          {isError && (
            <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
              <MdError className='text-red-500' size={45} />
              <p className='text-red-500'>Failed to load  products in cart</p>
            </div>
          )}

          <tbody className=''>
            {!isError && (
              cart?.items?.length > 0 ? (
                cart?.items?.map((item) => {
                  const Subtotal = item.price * item.quantity;

                  return (
                    <tr
                      key={item._id}
                      className='border-b border-gray-500'>
                        <td className='p-4 flex items-center gap-4'>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className='text-gray-500 hover:text-red-500 cursor-pointer'>
                              <FaTimes className='CartIcon' />
                          </button>

                          <img
                            src={item?.image}
                            alt={item?.name}
                            className='w-16 h-16 object-cover rounded cartImg'
                          />

                          <div className=''>
                            <p className='font-semibold cartItem'>{item?.name}</p>
                            <p className='text-sm text-gray-500 CartVenItem'>Vendor item</p>
                          </div>
                        </td>
                        
                        <td className='p-4 font-medium'>
                          Ksh {(item?.price / 100).toLocaleString()}
                        </td>

                        <td className='p-4'>
                          <div className='flex items-center border rounded w-fit'>
                            <button
                              onClick={() => handleDecrease(item)}
                              className='px-3 py-1 cursor-pointer'
                              >
                                <FaMinus className='' size={12} />
                            </button>

                            <span className='px-4'>
                              {item?.quantity}
                            </span>

                            <button
                              onClick={() => handleIncrease(item)}
                              className='px-3 py-1 cursor-pointer'
                              >
                                <FaPlus className=''  size={12}/>
                            </button>
                          </div>
                        </td>

                        <td className='p-4 font-semibold'>
                          Ksh {(Subtotal / 100).toLocaleString()}
                        </td>
                    </tr>
                  );
                })
              ) : (
                <div className=' my-5 flex flex-col justify-center items-center text-center text-gray-500 gap-2'>
                  <MdRemoveShoppingCart className='text-red-500' size={45} />
                  <p>No products in cart</p>
                </div>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default CartTable