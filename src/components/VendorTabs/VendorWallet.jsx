import React, { useState, useEffect } from 'react';
import './vendorTabs.css';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { Toaster } from 'react-hot-toast';
import useWallet from '../../Hooks/useWallet';
import { AdLoader, WithdrawalModal, WithdrawalRequest } from '../';
import { TbWalletOff } from "react-icons/tb";
import { logoIcon } from '../../assets';
import { PiContactlessPaymentLight, PiContactlessPaymentFill } from "react-icons/pi";
import { IoIosArrowRoundDown, IoIosWarning } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline, IoHourglassOutline, IoCheckmarkCircle, IoBan  } from "react-icons/io5";
import { TbPlayerEjectFilled } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";
import { FaShoppingCart, FaMoneyBillWave, FaMoneyCheckAlt, FaTimesCircle, FaUndo, FaSlidersH, FaPercentage, FaUnlockAlt, FaUniversity } from 'react-icons/fa';

function VendorWallet() {
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [balanceVisibility, setBalanceVisibility] = useState(() => {
    const saved = localStorage.getItem('balanceVisibility');

    return saved ? JSON.parse(saved) : {
      available: true,
      reserved: true,
      pending: true,
    };
  });

  const { data: me, isLoading } = useCurrentUser();
  const role = me?.role;
  const store = me?.storeName;

  const { getWallet, requestWithdrawal, getWithdrawalHistory, getVendorWalletTransactions } = useWallet(role);

  const { data, isLoading: isWalletLoading, isError: isWalletError } = getWallet;
  const { data: requestHistory, isError: isRequestError, isLoading: isRequestLoading } = getWithdrawalHistory(page, 10);
  const { data: walletTransactions, isError: isTransactionError, isLoading: isTransactionLoading } = getVendorWalletTransactions;

  const wallet = data?.wallet;
  const withdrawalRequest = requestHistory?.withdrawals || [];
  const transactions = walletTransactions?.walletTransactions;
  const totalPages = requestHistory?.pagination?.totalPages;

  useEffect(() => {
    localStorage.setItem(
      'balanceVisibility',
      JSON.stringify(balanceVisibility)
    );
  }, [balanceVisibility]);

  const toggleBalance = (key) => {
    setBalanceVisibility(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const statusConfig = {
    pending: {
      bg: 'bg-purple-300',
      text: 'text-purple-700',
      icon: IoHourglassOutline,
    },
    approved: {
      bg: 'bg-blue-300',
      text: 'text-blue-700',
      icon: IoCheckmarkCircle,
    },
    paid: {
      bg: 'bg-green-300',
      text: 'text-green-700',
      icon: PiContactlessPaymentFill,
    },
    rejected: {
      bg: 'bg-red-300',
      text: 'text-red-700',
      icon: TbPlayerEjectFilled,
    },
    cancelled: {
      bg: 'bg-gray-300',
      text: 'text-gray-700',
      icon: IoBan,
    },
    failed: {
      bg: 'bg-yellow-300',
      text: 'text-yellow-700',
      icon: IoIosWarning,
    },
  };

  const getPaymentDateDisplay = (withdrawal) => {
    if (withdrawal.paidAt) {
      return new Date(withdrawal.paidAt).toISOString().split('T')[0];
    }

    switch (withdrawal.status) {
      case 'pending': 
       return 'Not paid';
      
      case 'approved':
       return 'Processing';

      case 'rejected':
        return 'Rejected';

      case 'failed':
        return 'Failed';

      case 'cancelled':
        return 'Cancelled';
    }
  };

  const transactionIcons = {
    sale: FaShoppingCart,
    withdrawal_request: FaMoneyBillWave,
    withdrawal_paid: FaMoneyCheckAlt,
    withdrawal_rejected: FaTimesCircle,
    refund: FaUndo,
    adjustment: FaSlidersH,
    commission: FaPercentage,
    reserve_release: FaUnlockAlt,
    settlement: FaUniversity,
  };

  const getSign = (direction) => {
    return direction === 'credit' ? '+' : '-';
  };

  const getColor = (direction) => {
    return direction === 'credit' ? 'text-green-600' : 'text-red-500';
  };

  //console.log('History', withdrawalRequest);
  //console.log('Transaction', transactions);
  //console.log('Total pages', totalPages);
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
              <div className='grid grid-cols-[70%_30%] gap-2 withdrawalContainer'>
                <div className='flex flex-col gap-3'>
                  <div className='flex flex-col space-y-2 pr-2'>
                    <div className='grid grid-cols-[40%_60%] gap-2 withCardContainer'>
                      <div className='relative h-40 w-full overflow-hidden rounded-2xl p-3 bg-linear-to-r from-blue-900/90 via-blue-800 to-blue-700 shadow-sm withdrawalCard'>
                        <div className='absolute inset-0 bg-linear-to-r from-blue-900/10 via-transparent to-amber-300/10 backdrop-blur-3xl rounded-2xl' />
                        <div className='absolute top-0 right-0 w-full h-full bg-yellow-500/10 rounded-full blur-3xl ' />
                        <div className='relative z-10 text-white  h-full flex flex-col justify-between'>
                          <div className='flex items-center justify-between'>
                            <h2 className='text-gray-300 withBal'>Balance</h2>
                            <PiContactlessPaymentLight className='text-white withBalIcon' size={25} />
                          </div>
                          <div className='flex items-center gap-3'>
                            <h1 className='text-white font-semibold text-2xl withBal01'>
                              {balanceVisibility.available
                                ? `ksh ${(wallet?.availableBalance /100). toLocaleString()}`
                                : 'Ksh ******'
                              }
                            </h1>

                            <button 
                              onClick={() => toggleBalance('available')}
                              className='text-white hover:text-orange-400 transition-colors'
                              aria-label={balanceVisibility.available ? 'Hide balance' : 'show balance'}
                              >
                                { balanceVisibility.available ? <IoEyeOutline className='cursor-pointer withBalIcon02' size={20} /> : <IoEyeOffOutline className='cursor-pointer withBalIcon02' size={20} />}
                              </button>
                          </div>
                          <div className='flex items-center justify-between'>
                            <button
                              onClick={() => setShowWithdrawalModal(true)}
                              className='cursor-pointer px-2 py-1 rounded-full bg-gray-400 text-white flex items-center gap-2 w-fit withBtn'>
                                Request payment
                                <span className=''>
                                  <IoIosArrowRoundDown className='font-semibold withBalIcon02' size={22}/>
                                </span>
                            </button>
                            <img 
                            src={logoIcon} 
                            alt='icon' 
                            className='h-7 w-7 withImg'
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
                      <div className='grid grid-cols-2 gap-2 Balances'>
                        <div className='shadow-md bg-gray-200 p-2 rounded-2xl flex flex-col justify-between'>
                          <h1 className='font-semibold text-gray-600 withBal'>Pending Balance</h1>
                          <div className='flex items-center gap-3'>
                            <h1 className='text-dark font-semibold text-2xl withBal02'>
                              {balanceVisibility.pending
                                ? `ksh ${(wallet?.pendingBalance /100). toLocaleString()}`
                                : 'Ksh ******'
                              }
                            </h1>

                            <button 
                              onClick={() => toggleBalance('pending')}
                              className='text-dark hover:text-secondary transition-colors'
                              aria-label={balanceVisibility.pending ? 'Hide balance' : 'show balance'}
                              >
                                {balanceVisibility.pending ? <IoEyeOutline className='cursor-pointer withBalIcon02' size={20} /> : <IoEyeOffOutline className='cursor-pointer withBalIcon02' size={20} />}
                              </button>
                          </div>
                          <p className='uppercase text-black text-xs withBal03'>{store}</p>
                        </div>
                        <div className='shadow-md bg-gray-200 p-2 rounded-2xl flex flex-col justify-between pr-4'>
                          <h1 className='font-semibold text-gray-600 withBal'>Reserved Balance</h1>
                          <div className='flex items-center gap-3'>
                            <h1 className='text-dark font-semibold text-2xl withBal02'>
                              {balanceVisibility.reserved
                                ? `ksh ${(wallet?.reservedBalance /100). toLocaleString()}`
                                : 'Ksh ******'
                              }
                            </h1>

                            <button 
                              onClick={() => toggleBalance('reserved')}
                              className='text-dark hover:text-secondary transition-colors'
                              aria-label={balanceVisibility.reserved ? 'Hide balance' : 'show balance'}
                              >
                                { balanceVisibility.reserved ? <IoEyeOutline className='cursor-pointer withBalIcon02' size={20} /> : <IoEyeOffOutline className='cursor-pointer withBalIcon02' size={20} />}
                              </button>
                          </div>
                          <p className='uppercase text-black text-xs withBal03'>{store}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='h-[50vh] overflow-y-auto mt-2 py-3 px-2'>
                    <div className='flex items-center justify-between my-3'>
                      <h1 className='font-semibold text-dark underline'>
                        Payment Requests
                      </h1>
                    </div>
                    <table className='w-full border-[1.4px]  border-gray-300 border-separate border-spacing-0 rounded-lg overflow-x-auto PaymentsRequestLg'>
                      <thead className=''>
                        <tr className='bg-gray-200 text-left text-sm text-gray-600 rounded-lg font-light'>
                        <th className='p-3 rounded-tl-lg'>Request ID</th>
                          <th className='p-3'>Amount</th>
                          <th className='p-3'>Paid to</th>
                          <th className='p-3'>Status</th>
                          <th className='p-3'>Paid At</th>
                          <th className='p-3 rounded-tr-lg'></th>
                        </tr>
                      </thead>
                      <tbody className=''>
                        {withdrawalRequest.map((item) => {
                          const config = statusConfig[item?.status] ?? statusConfig.pending;
                          const Icon = config.icon;

                          return (
                            <tr 
                              key={item._id}
                              className='last:[&>td]:border-b-0 [&>td]:border-b-[1.2px] [&>td]:border-gray-300 text-gray-500 text-md'
                             >
                              <td className='p-2'>
                                {item?.requestUUID}
                              </td>
                              <td className='p-2'>
                                {(item?.amount / 100).toLocaleString()}
                              </td>
                              <td className='p-2'>
                                {(item?.paymentMethodSnapshot?.tillNumber)}
                              </td>
                              <td className='p-2'>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium withStatus92 ${config.bg} ${config.text}`}
                                  >
                                  <Icon className='withEyeIcon23' size={15} />
                                  {item?.status}
                                </span>
                              </td>
                              <td className='p-2'>
                                {getPaymentDateDisplay(item)}
                              </td>
                              <td className='p-2'>
                                <span className='flex items-center gap-1'>
                                  <IoEyeOutline 
                                    onClick={() => {
                                      setSelectedRequest(item);
                                      setShowRequestModal(true);
                                    }}
                                    className='text-primary cursor-pointer withEyeIcon23' size={20} />
                                  {/*<IoBan className='cursor-pointer' size={15} />*/}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>

                    <div className='withdarawalRequestsCards gap-3'>
                      {withdrawalRequest.map((item) => {
                        const config = statusConfig[item?.status] ?? statusConfig.pending;
                        const Icon = config.icon;

                        return (
                          <div 
                            key={item._id}
                            className='flex flex-col space-y-1 rounded shadow p-2 bg-gray-100'
                            >
                              <div className='flex items-center justify-between'>
                                <p className='text-sm font-medium text-gray-600'>
                                  {item?.requestUUID}
                                </p>
                                <p className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold w-fit text-right ${config.bg} $ {config.text}`}
                                  >
                                  <Icon size={16} />
                                  {item?.status}
                                </p>
                              </div>
                              <div className='grid grid-cols-2 gap-2 space-y-2'>
                                <p className='flex flex-col text-dark font-semibold'>
                                  Payment to 
                                  <span className='text-gray-700 font-medium'
                                   >
                                   {item?.paymentMethodSnapshot?.tillNumber}
                                  </span>
                                </p>
                                <p className='flex flex-col text-dark font-semibold items-end'>
                                  Amount
                                  <span className='text-gray-700 font-medium'
                                   >
                                   {(item?.amount / 100).toLocaleString()}
                                  </span>
                                </p>
                                <p className='flex flex-col text-dark font-semibold'>
                                  Paid At
                                  <span className='text-gray-700 font-medium'
                                   >
                                   {getPaymentDateDisplay(item)}
                                  </span>
                                </p>
                              </div>
                                <button
                                  onClick={() => {
                                    setSelectedRequest(item);
                                    setShowRequestModal(true);
                                  }}
                                  className='text-gray-500 cursor-pointer hover:underline'
                                  >
                                    View
                                </button>
                                {/*className='text-primary cursor-pointer' size={20} />*/}
                                {/*<IoBan className='cursor-pointer' size={15} />*/}
                          </div>
                        )
                      })}
                    </div>

                    <div className='flex justify-between items-center CatNav mt-4'>
                      <button 
                        disabled={page <= 1} 
                        onClick={() => setPage(page - 1)}
                        className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
                        >
                          Prev
                      </button>
                      <span className=''>
                        Page {page} of {totalPages}
                      </span>
                      <button 
                        disabled={page >= totalPages} 
                        onClick={() => setPage(page + 1)}
                        className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
                        >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
                <div className='bg-gray-200 relative rounded-lg'>
                  <div className='absolute inset-0 bg-white/20 backdrop-blur-3xl rounded-lg'/>
                    {isTransactionLoading ? (
                      <div className='relative z-10 h-full flex justify-center items-center'>
                        <p className='text-dark'>Loading transactions...</p>
                      </div>
                    ) : isTransactionError ? (
                      <div className='relative z-10 h-full flex justify-center items-center'>
                        <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                          <GrTransaction className='text-red-500' size={45} />
                          <p className='text-red-500'>Failed to Load wallet transactions!</p>
                        </div>
                      </div>
                    ) : transactions.length > 0 ? (
                      <div className='relative z-10 p-2 flex flex-col gap-2 shadow-xs h-[80vh] overflow-y-auto'>
                        <div className='sticky top-0 bg-gray-200 backdrop-blur-md z-20 py-2'>
                          <h1 className='font-semibold text-dark underline transactHead'>
                            Wallet Transactions
                          </h1>
                        </div>
                        <div className='flex-1 overflow-y-auto flex flex-col gap-2'>
                          {transactions.map((item) => {
                            const Icon = transactionIcons[item?.type] || FaMoneyBillWave;

                            return (
                              <div
                                key={item._id}
                                className='bg-white rounded-md p-2 flex flex-col'>
                                  <div className='flex gap-2 items-center'>
                                    <div className='p-3 rounded-full bg-gray-200 h-fit w-fit '>
                                      <Icon className='text-gray-700 text-base transactIcon'/>
                                    </div>
                                    <div className='flex flex-col gap-2 w-full'>
                                      <div className='flex justify-between'>
                                        <p className='text-sm font-medium capitalize text-gray-500'>
                                          {item?.type.replace('_', ' ')}
                                        </p>
                                        <p className={`font-normal text-sm ${getColor(item?.direction)}`}>
                                          {getSign(item?.direction)}KES {(item?.amount / 100).toLocaleString()}
                                        </p>
                                      </div>

                                      <div className='flex justify-between'>
                                        <p className='text-sm font-medium capitalize text-gray-400'>
                                          {new Date(item?.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className='text-sm font-medium capitalize text-gray-400'>
                                          {item?.referenceModel}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <p className='text-sm my-2 font-medium capitalize text-gray-700'>
                                    {item?.description}
                                  </p>
                                </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className='relative z-10 h-full flex justify-center items-center'>
                        <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                          <GrTransaction className='text-red-500' size={45} />
                          <p className='text-red-500'>No wallet transactions yet!</p>
                        </div>
                      </div>
                    )}
                  </div>
              </div>
            )}
          </div>

          {
            <WithdrawalModal
              isOpen={showWithdrawalModal}
              onClose={() => setShowWithdrawalModal(false)}
              submit={requestWithdrawal.mutateAsync}
              isSubmitting={requestWithdrawal.isPending}
              availableBalance={wallet?.availableBalance}
            />
          }

          {showRequestModal && (
            <WithdrawalRequest
              selectedRequest={selectedRequest}
              onClose={() => setShowRequestModal(false)}
              status={statusConfig[selectedRequest?.status] ?? statusConfig.pending}
            />
          )}
        </>
      )}
      
    </section>
  )
}

export default VendorWallet