import React, { useState } from 'react';
import './vendorTabs.css';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { Toaster } from 'react-hot-toast';
import useWallet from '../../Hooks/useWallet';
import { AdLoader, WithdrawalModal } from '../';
import { TbWalletOff } from "react-icons/tb";
import { logoIcon } from '../../assets';
import { PiContactlessPaymentLight } from "react-icons/pi";
import { IoIosArrowRoundDown } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

function VendorWallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [showReserveBal, setShowReserveBal] = useState(true);
  const [showPendingleBal, setShowPendingBal] = useState(true);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  const { data: user } = useCurrentUser();
  const store = user?.storeName;

  const { data: me, isLoading } = useCurrentUser();
  const role = me?.role;

  const { getWallet, requestWithdrawal } = useWallet(role);

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
                <div className='flex flex-col gap-3'>
                  <div className='flex flex-col space-y-2 pr-2'>
                    <div className='grid grid-cols-[40%_60%] gap-2'>
                      <div className='relative h-40 w-full overflow-hidden rounded-2xl p-3 bg-linear-to-r from-blue-900/90 via-blue-800 to-blue-700 shadow-sm'>
                        <div className='absolute inset-0 bg-linear-to-r from-blue-900/10 via-transparent to-amber-300/10 backdrop-blur-3xl rounded-2xl' />
                        <div className='absolute top-0 right-0 w-full h-full bg-yellow-500/10 rounded-full blur-3xl ' />
                        <div className='relative z-10 text-white  h-full flex flex-col justify-between'>
                          <div className='flex items-center justify-between'>
                            <h2 className='text-gray-300'>Balance</h2>
                            <PiContactlessPaymentLight className='text-white' size={25} />
                          </div>
                          <div className='flex items-center gap-3'>
                            <h1 className='text-white font-semibold text-2xl'>
                              {showBalance
                                ? `ksh ${(wallet?.availableBalance /100). toLocaleString()}`
                                : 'Ksh ******'
                              }
                            </h1>

                            <button 
                              onClick={() => setShowBalance(!showBalance)}
                              className='text-white hover:text-gray-300 transition-colors'
                              aria-label={showBalance ? 'Hide balance' : 'show balance'}
                              >
                                { showBalance ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                              </button>
                          </div>
                          <div className='flex items-center justify-between'>
                            <button
                              onClick={() => setShowWithdrawalModal(true)}
                              className='cursor-pointer px-2 py-1 rounded-full bg-gray-400 text-white flex items-center gap-2 w-fit'>
                                Request payment
                                <span className=''>
                                  <IoIosArrowRoundDown className='font-semibold' size={22}/>
                                </span>
                            </button>
                            <img 
                            src={logoIcon} 
                            alt='icon' 
                            className='h-7 w-7'
                            />
                          </div>
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
                      <div className='grid grid-cols-2 gap-2'>
                        <div className='shadow-md bg-gray-200 p-2 rounded-2xl flex flex-col justify-between'>
                          <h1 className='font-semibold text-gray-600'>Pending Balance</h1>
                          <div className='flex items-center gap-3'>
                            <h1 className='text-dark font-semibold text-2xl'>
                              {showPendingleBal
                                ? `ksh ${(wallet?.pendingBalance /100). toLocaleString()}`
                                : 'Ksh ******'
                              }
                            </h1>

                            <button 
                              onClick={() => setShowPendingBal(!showPendingleBal)}
                              className='text-dark hover:text-secondary transition-colors'
                              aria-label={showPendingleBal ? 'Hide balance' : 'show balance'}
                              >
                                { showPendingleBal ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                              </button>
                          </div>
                          <p className='uppercase text-black text-xs'>{store}</p>
                        </div>
                        <div className='shadow-md bg-gray-200 p-2 rounded-2xl flex flex-col justify-between pr-4'>
                          <h1 className='font-semibold text-gray-600'>Reserved Balance</h1>
                          <div className='flex items-center gap-3'>
                            <h1 className='text-dark font-semibold text-2xl'>
                              {showReserveBal
                                ? `ksh ${(wallet?.reservedBalance /100). toLocaleString()}`
                                : 'Ksh ******'
                              }
                            </h1>

                            <button 
                              onClick={() => setShowReserveBal(!showReserveBal)}
                              className='text-dark hover:text-secondary transition-colors'
                              aria-label={showReserveBal ? 'Hide balance' : 'show balance'}
                              >
                                { showReserveBal ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                              </button>
                          </div>
                          <p className='uppercase text-black text-xs'>{store}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='min-h-[50vh] mt-5 py-3'>
                    <table className='w-full border border-gray-300 border-separate border-spacing-0 rounded-lg overflow-hidden PaymentsRequestLg'>
                      <thead className=''>
                        <tr className='bg-gray-200 text-left text-sm text-gray-600 rounded-lg font-light'>
                          <th className='p-3 rounded-tl-lg'>Amount</th>
                          <th className='p-3'>Paid to</th>
                          <th className='p-3'>Status</th>
                          <th className='p-3 rounded-tr-lg'>Paid At</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>jcdc</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className='bg-red-400'>dd</div>
              </div>
            )}
          </div>

          {<WithdrawalModal
            isOpen={showWithdrawalModal}
            onClose={() => setShowWithdrawalModal(false)}
            submit={requestWithdrawal.mutateAsync}
            isSubmitting={requestWithdrawal.isPending}
            availableBalance={wallet?.availableBalance}
          />}
        </>
      )}
      
    </section>
  )
}

export default VendorWallet