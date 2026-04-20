import React from 'react';
import '../BuyerTabs.css';
import { FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import { AdLoader } from '../../';
import { MdRemoveShoppingCart, MdError, MdErrorOutline, MdDeleteOutline } from "react-icons/md";

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
    <>
      {isLoading ? (
          <div className='fixed inset-0 flex items-center justify-center bg-white/90 z-50'>
            <AdLoader/>
          </div>
        ) : (
          <>
            <div className='w-full overflow-x-auto mt-10 p-2 table-view'>
                <>
                  {isError && (
                    <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                      <MdError className='text-red-500' size={55} />
                      <p className='text-red-500'>Failed to load  products in cart</p>
                    </div>
                  )}

                  {!isError && (
                    cart?.items?.length > 0 ? (
                      <table className='w-full border-collapse CartTable'>
                        <thead className=''>
                          <tr className='bg-secondary text-left text-sm font-medium text-dark rounded-lg'>
                            <th className='p-3 rounded-l-lg'>Product</th>
                            <th className='p-3'>Price</th>
                            <th className='p-3'>Quantity</th>
                            <th className='p-3 rounded-r-lg'>Subtotal</th>
                          </tr>
                        </thead>

                        <tbody className=''>
                          {cart.items.map((item) => {
                            const unitPrice = item.discount > 0 ? item.discountPrice : item.price;
                            const Subtotal = unitPrice * item.quantity;

                            return(
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
                                      className='w-16 h-16 object-contain rounded cartImg'
                                    />

                                    <div className=''>
                                      <p className='font-semibold cartItem'>{item?.name}</p>
                                      <p className='text-sm text-gray-500 CartVenItem'>Vendor item</p>
                                    </div>
                                  </td>
                                  
                                  <td className='p-4 font-medium'>
                                    {item?.discount > 0 ? (
                                      <p className=''>
                                        Ksh {(item.discountPrice / 100).toLocaleString()}
                                      </p>
                                    ) : (
                                      <p className=''>
                                        Ksh {(item.price / 100).toLocaleString()}
                                      </p>
                                    )}
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
                            )
                          })}                 
                        </tbody>
                      </table>
                    ) : (
                      <div className=' my-5 flex flex-col justify-center items-center text-center text-gray-500 gap-2'>
                        <MdRemoveShoppingCart className='text-red-500' size={55} />
                        <p className='font-semibold text-dark text-xl'>
                          Your cart is empty!
                        </p>
                        <p className='text-base text-gray-600'>
                          Browse categories and discover our best deals
                        </p>
                      </div>
                    )
                  )}
                </>
            </div>

            <div className='card-view'>
              {isError && (
                <div className=' my-5 flex flex-col justify-center items-center text-center gap-2'>
                  <MdError className='text-red-500' size={55} />
                  <p className='text-base text-red-500'>
                    Failed to load products in cart
                  </p>
                </div>
              )}

              {!isError && (
                cart?.items?.length > 0 ? (
                  <div className=''>
                    {cart.items.map((item) => {
                      const unitPrice = item.discount > 0 ? item.discountPrice : item.price;
                      const Subtotal = unitPrice * item.quantity;

                      return (
                        <div 
                          key={item._id}
                          className='flex flex-col gap-2 border-[1.5px] border-gray-300 shadow-md mb-2 rounded p-2'>
                          <div 
                           className='flex gap-2'>
                            <img
                              src={item?.image}
                              alt={item?.name}
                              className='w-30 h-30 rounded object-contain'
                            />

                            <div className='flex flex-col gap-2'>
                              <p className='text-sm text-gray-500'>{item.description}</p>
                              <div className='flex items-center gap-2 DisCardText'>
                                {item?.discount > 0 ? (
                                  <>
                                    <p className='text-lg font-semibold text-primary'>
                                      Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.discountPrice / 100)}
                                    </p>

                                    <p className='text-xs font-medium text-gray-500 line-through'>
                                      Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.price / 100)}
                                    </p>                
                                  </>
                                ) : (
                                  <p className='text-lg font-semibold text-primary'>
                                    Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item?.price / 100)}
                                  </p>
                                )}

                              </div>
                              <div className='flex items-center gap-2'>
                                {item.productQuantity < 5  ? (
                                  <p className='flex items-center gap-2 text-xs'>
                                    <MdErrorOutline className='text-red-600' size={15} />
                                    <span className=''>
                                      {item.productQuantity} units left
                                    </span>
                                  </p>
                                ) : (
                                  <p className=''></p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className='flex items-center justify-between subTotals'>
                            <p 
                             onClick={() => handleRemove(item.productId)}
                             className='flex items-center gap-2 cursor-pointer text-primary text-xs hover:underline'>
                              <MdDeleteOutline className='' size={20} />
                              Remove
                            </p>
                            <div className='flex flex-col items-center'>
                              <span className='text-xs text-gray-500'>Subtotal</span>
                              <p className='font-semibold text-primary'>
                                Ksh {(Subtotal / 100).toLocaleString()}
                              </p>
                            </div>
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
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className=' my-5 flex flex-col justify-center items-center text-center text-gray-500 gap-2'>
                    <MdRemoveShoppingCart className='text-red-500' size={55} />
                    <p className='font-semibold text-dark text-xl'>
                      Your cart is empty!
                    </p>
                    <p className='text-base text-gray-600'>
                      Browse categories and discover our best deals
                    </p>
                  </div>
                )
              )}
            </div>
          </>
        )
      }
    </>
  )
}

export default CartTable