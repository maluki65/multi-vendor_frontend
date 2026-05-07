import React from 'react';
import '../BuyerTabs.css';
import { AdLoader } from '../../';
import useCart from '../../../Hooks/useCart';
import { MdOutlineFolderOff } from "react-icons/md";
import { LuFolderHeart } from "react-icons/lu";
import { FaTimes } from 'react-icons/fa';

function WishlistTable({ wishlist, totalWishlistItems, isLoading, isError, removeFromWishlist }) {
  const { addToCart } = useCart();

  const handleRemoveFromWishlist = (id) => {
    removeFromWishlist.mutate(id);
  };

  return (
    <>
      {isLoading ? (
        <div className='fixed inset-0 flex items-center justify-center bg-white/90 z-50'>
          <AdLoader />
        </div>
      ) : (
        <>
          <div className='w-full overflow-x-auto mt-10 p-2 table-view'>
            <>
              {isError && (
                <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                  <MdOutlineFolderOff className='text-red-500' size={65} />
                  <p className='text-red-500'>Failed to load  products in wishlist</p>
                </div>
              )}

              {!isError &&(
                wishlist?.length > 0 ? (
                  <table className='w-full border-collapse CartTable'>
                    <thead className=''>
                      <tr className='bg-secondary text-left text-sm font-medium text-dark rounded-lg'>
                        <th className='p-3 rounded-l-lg'>Product</th>
                        <th className='p-3'>Price</th>
                        <th className='p-3'>Date Created</th>
                        <th className='p-3'> Stock status</th>
                        <th className='p-3 rounded-r-lg'></th>
                      </tr>
                    </thead>
                    
                    <tbody className=''>
                      {wishlist.map((item) => {
                        return (
                          <tr
                            key={item._id}
                            className='border-b border-gray-300'>
                              <td className='p-4 flex items-center gap-4'>
                                <button
                                  onClick={() => 
                                  handleRemoveFromWishlist(item._id)}
                                  className='text-gray-500 hover:text-red-500 cursor-pointer'>
                                    <FaTimes className='CartIcon' />
                                </button>

                                <img 
                                  src={item?.MainIMg}
                                  alt={item.name}
                                  className='w-16 h-16 object-contain rounded cartImg'
                                />

                                <div className=''>
                                  <p className='font-semibold cartItem'>{item?.name}</p>
                                  <p className='text-sm text-gray-500 CartVenItem'>Vendor item</p>
                                </div>
                              </td>

                              <td className='p-4 font-semibold'>
                                {item?.discount > 0 ? (
                                  <p className=''>
                                    Ksh {(item.discountPrice / 100).toLocaleString()}
                                  </p>
                                ): (
                                  <p className=''>
                                    Ksh {(item.price / 100).toLocaleString()}
                                  </p>
                                )}
                              </td>
                              <td className='p-4 font-medium'>
                                <p className=''>
                                  {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                              </td>
                              <td className='p-4 font-medium'>
                                {item.quantity < 5 ? (
                                  <span className='text-red-500 bg-red-300 rounded-full px-3 py-1 text-sm'>
                                    Limited stock
                                  </span>
                                ) : (
                                  <span className='text-green-500 bg-green-100 rounded-full px-3 py-1 text-sm'>
                                    In stock
                                  </span>
                                )}
                              </td>
                              <td className='p-4'>
                                <button
                                  onClick={() => {
                                    addToCart.mutate({
                                      productId: item._id,
                                      vendorId: item.vendorId?._id,
                                      vendorName: item.vendorId?.businessInfo?.legalName,
                                      quantity: 1,
                                      price: item.price,
                                      name: item.name,
                                      image: item.MainIMg,
                                      description: item.description,
                                      discount: item.discount,
                                      discountPrice: item.discountPrice,
                                      productQuantity: item.quantity,
                                    });
                                  }}
                                  className='bg-primary text-white rounded-full px-2 py-1 cursor-pointer'
                                  >
                                    Add to Cart
                                </button>
                              </td>
                            </tr>
                        )
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className=' my-5 flex flex-col justify-center items-center text-center text-gray-500 gap-2'>
                    <LuFolderHeart className='text-red-500' size={65} />
                    <p className='font-semibold text-dark text-xl'>
                      Your wishlist is empty!
                    </p>
                    <p className='text-base text-gray-600'>
                      Browse categories and discover our best deals
                    </p>
                  </div>
                )
              )}
            </>
          </div>
        </>
      )}
    </>
  )
}

export default WishlistTable