import React from 'react';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { Toaster } from 'react-hot-toast';
import useWallet from '../../Hooks/useWallet';
import { AdLoader } from '../';
import { TbWalletOff } from "react-icons/tb";
import { logoIcon } from '../../assets';
import { PiContactlessPaymentLight } from "react-icons/pi";
import { IoIosArrowRoundDown } from "react-icons/io";

function VendorWallet({ store }) {
  const { data: me, isLoading } = useCurrentUser();
  const role = me?.role;

  const { getWallet } = useWallet(role);

  const { data, isLoading: isWalletLoading, isError: isWalletError } = getWallet;

  const wallet = data?.wallet;

  console.log('Wallet', wallet);
  console.log('Role', role);

  return (
    <section className='overflow-hidden'>
      <Toaster position='top-right' reverseOrder={false} />
      {isWalletLoading ? (
        <div className='fixed inset-0 flex items-center justify-center bg-white/50 z-50'>
          <AdLoader/>
        </div>
      ): (
        <>
          <div className='p-4 my-4 bg-white rounded-md'>
            {isWalletError && (
              <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                <TbWalletOff className='text-red-500' size={65} />
                <p className='text-red-500'>Failed to Load wallet!</p>
              </div>
            )}

            {!isWalletError && (
              <div className='grid grid-cols-[70%_30%] gap-2'>
                <div className='flex flex-col space-y-2'>
                  <div className='grid grid-cols-[40%_30%_30%] gap-2'>
                    <div className='relative h-40 w-full overflow-hidden rounded-2xl p-3 bg-linear-to-r from-blue-900/90 via-blue-800 to-blue-700 shadow-sm'>
                      <div className='absolute inset-0 bg-linear-to-r from-blue-900/10 via-transparent to-amber-300/10' />
                      <div className='absolute top-0 right-0 w-full h-full bg-yellow-500/10 rounded-full blur-3xl' />
                      <div className='relative z-10 text-white  h-full flex flex-col justify-between'>
                        <div className='flex items-center justify-between'>
                          <h2 className='text-gray-300'>Balance</h2>
                          <PiContactlessPaymentLight className='text-white' size={25} />
                        </div>
                        <h1 className='text-white font-semibold text-2xl'>
                          ksh{(wallet?.availableBalance /100).toLocaleString()}
                        </h1>
                        <button
                          className='cursor-pointer px-2 py-1 rounded-full bg-purple-400 text-white flex items-center gap-2 w-fit'>
                            Request payment
                            <span className=''>
                              <IoIosArrowRoundDown className='font-semibold' size={22}/>
                            </span>
                          </button>
                        {/*<div className='flex justify-between items-center'>
                         <p className='uppercase text-gray-300 text-xs'>{store}</p>
                         <img 
                           src={logoIcon} 
                           alt='icon' 
                           className='h-7 w-7'
                          />
                        </div>*/}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-red-400'>dd</div>
              </div>
            )}
          </div>
        </>
      )}
      
    </section>
  )
}

export default VendorWallet