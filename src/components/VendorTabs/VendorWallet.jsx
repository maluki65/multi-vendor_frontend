import React from 'react';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { Toaster } from 'react-hot-toast';
import useWallet from '../../Hooks/useWallet';
import { AdLoader } from '../';
import { TbWalletOff } from "react-icons/tb";

function VendorWallet() {
  const { data: me, isLoading } = useCurrentUser();
  const role = me?.role;

  const { getWallet } = useWallet(role);

  const { data, isLoading: isWalletLoading, isError: isWalletError } = getWallet;

  const wallet = data?.wallet;

  //console.log('Wallet', wallet);
  //console.log('Role', role);

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
              <div className=''>Wallet</div>
            )}
          </div>
        </>
      )}
      
    </section>
  )
}

export default VendorWallet