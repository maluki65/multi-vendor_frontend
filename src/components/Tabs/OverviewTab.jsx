import React, { useEffect, useState, useRef  } from 'react';
import './Tabs.css';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentItem, SalesChart, RevenueChart, AdLoader, usePaymentApprove, AdminReqModals, VerifyDoc, RejectVendorModal } from '..';
import { IoCalendarOutline, IoChevronForward } from 'react-icons/io5';
import { MdOutlineProductionQuantityLimits, MdOutlineErrorOutline, MdOutlinePayments } from 'react-icons/md';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import usePendingVendors from '../../Hooks/usePendingVendors';
import { FaRecordVinyl } from "react-icons/fa";
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosSearch } from 'react-icons/io';
import { useAuth } from '../../Context/AuthContext';
import useAnalytics from '../../Hooks/useAnalytics';
import { Toaster } from 'react-hot-toast';
import CountUp from 'react-countup';
import useWallet from '../../Hooks/useWallet';
import { CiCreditCardOff } from "react-icons/ci";
import { PiContactlessPaymentFill } from "react-icons/pi";
import useVerification from '../../Hooks/useVerification';
import useVendorAction from '../../Hooks/useVendorAction';

function OverviewTab() {
  const [modalType, setModalType] = useState(null);
  const [rejectionModal, setRejecionModal] = useState(null);
  const [verifyModal, setVerifyModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openVendorMenuId, setOpenVendorMenuId] = useState(null);

  const [now, setNow] = React.useState(new Date());  
  
  const { userData } = useAuth();
  const role = userData?.role;
  const vendorRef = useRef();
  
  const { data, isLoading, isError } = usePendingVendors();
  const { getPendingWithdrawalRequests, rejectWithdrawalRequest, approveWithdrawalRequest } = useWallet(role);

  const { getVerificationByUserId } = useVerification();
  const { handleVendorActions, isLoading: isActionLoading } = useVendorAction();

  const vendorVerificationQuery = getVerificationByUserId(selectedVendorId);

  const { getAdminAnalytics } = useAnalytics(role);
  const { data: adminAnalytics, isLoading: isAnalyticsLoading, isError: isAnalyticsError } = getAdminAnalytics;
  const { data: pendingRequests, isLoading: paymentLoading, isError: paymentError } = getPendingWithdrawalRequests(1, 10);

  
  //console.log('Admin analytics:', adminAnalytics);
  const commission = (adminAnalytics?.totalPlatformCommission || 0) / 100;
  const revenue = (adminAnalytics?.totalRevenue || 0) / 100;

  const revenueTrend = adminAnalytics?.revenueTrend || 0;
  const commissionTrend = adminAnalytics?.commissionTrend || 0;
  const paymentRequests = pendingRequests?.withdrawals || []

  const revenueIncrease = revenueTrend >= 0;
  const commissionIncrease = commissionTrend >= 0;

  const confirmApproval = usePaymentApprove();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getFirstTwoChars = (name) => {
    return name.slice(0,2).toUpperCase();
  }
  
  const formatDate = (date) => {
    const day = date.getDate();
    const year = date.getFullYear();

    const month = date.toLocaleString('en-US', { month: 'long'});

    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10 ) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinal(day)} ${month} ${year}`;
  };

  const formatDateTime = (date) => {
    const formattedDate = formatDate(date);

    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} • ${formattedTime}`;
  }

  const handleView = (request) => {
    setOpenMenuId(null);
    setSelectedRequest(request);
    setModalType('view');
    setShowModal(true);
  }

  const handleApprove = (request) => {
    setOpenMenuId(null);

    confirmApproval({
      vendor: request?.vendorName,
      onApprove: () => {
        approveWithdrawalRequest.mutate({
          withdrawalId: request?._id,
          adminNotes: '',
        });
      },
    });
  };

  const handleReject = (request) => {
    setOpenMenuId(null);
    setSelectedRequest(request);
    setModalType('reject');
    setShowModal(true);
  };

  const openVendorModal = (vendor) => {
    setSelectedVendorId(vendor._id);
    setSelectedVendor(vendor);
    setVerifyModal(true);
  }

  const openRejectionModal = (vendor) => {
    setSelectedVendor(vendor);
    setRejecionModal(true);
  }

  useEffect (() => {
    const handleClickOutside = (e) => {
      if (vendorRef.current && !vendorRef.current.contains(e.target)) {
        setOpenVendorMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  //console.log('payments', paymentRequests)
  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />
      {isAnalyticsLoading && (
        <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
          <AdLoader/>
        </div>
      )}
      <div className='grid grid-cols-[75%_25%] gap-3 bg-transparent overview'>
        <div className='flex flex-col gap-4 border-r-2 border-gray-300 px-2 OverCard'>
          <div className='flex items-end justify-between DashIntro'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-xl text-black font-medium leading-relaxed HDash'>
                Dashboard
              </h1>
              <p className='text-md text-gray-500 PDash'>
                An easy way to manage vendors, orders and buyers with ease
              </p>
            </div>
            <div className='rounded-full border-2 border-gray-300 py-1 px-3 flex items-base w-fit gap-2 text-gray-600 IContainer'>
              <IoCalendarOutline className='Icon' size={20}/>
              <p className='text-sm cal'>{formatDateTime(now)}</p>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-2 AnaCards'>
            <div className='rounded-xl border-gray-300 p-2 bg-dark'>
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center gap-1'>
                  <div className='bg-red-300 text-md p-1 rounded-full flex items-center'>
                  <FaRecordVinyl className='text-red-400' size={10}/>
                  </div>
                  <p className='text-sm text-white'> Update</p>
                </div>
                <p className='text-sm text-primary'>{formatDate(now)}</p>
                <p className='text-white text-md'>Sales revenue {' '}
                  {adminAnalytics?.hasCurrentRevenue ? (
                    <>
                      <span className='text-primary'>
                        {revenueIncrease ? 'increased' : 'decreased'}
                      </span>
                      {' '} by {' '}
                      <span className='text-primary'>
                        {Math.abs(revenueTrend)}%
                      </span>
                      {' '} this month
                    </>
                  ) : (
                    <span className='text-primary'>
                      No sales recorded this month
                    </span>
                  )}
                </p>
                <a className='text-[#ada9a9] text-sm flex items-center cursor-pointer hover:underline'>
                see more <IoChevronForward/>
                </a>
              </div>
            </div>
            <div className='rounded-xl border-2 border-gray-300 bg-white p-2 flex flex-col space-y-2 justify-between'>
              <div className='flex items-center justify-between'>
                <h3 className='text-md text-gray-800'>Total Revenue</h3>
                {/*<BiDotsHorizontalRounded className='cursor-pointer Icon' size={20}/>*/}
              </div>
              <h1 className="text-3xl font-semibold">
                <sup className="text-sm align-super mr-1">Ksh</sup>
                <CountUp
                  end={revenue}
                  duration={1.5}
                  separator=','
                  decimal={0}
                />
              </h1>
              <p className='text-sm flex items-center gap-2 text-[#787777]'>
                {revenueIncrease ? (
                  <FaArrowTrendUp className='text-green-400'/>
                ) : (
                  <FaArrowTrendDown className='text-red-500'/>
                )}

                <span 
                className={
                  revenueIncrease
                    ? 'text-green-400'
                    : 'text-red-500'
                }
                >
                  {adminAnalytics?.hasCurrentRevenue ? (
                    <span className='flex items-center gap-4'>
                        <span className=''>
                          {revenueIncrease ? '+' : '-'}
                          {Math.abs(revenueTrend)}%
                        </span>
                        <span className='text-[#787777]'>
                        from last month
                        </span>
                      </span>
                    ) : (
                      'No revenue this month'
                    )}
                </span>
              </p>
            </div>
            <div className='rounded-xl border-2 border-gray-300 bg-white p-2 flex flex-col space-y-2 justify-between'>
              <div className='flex items-center justify-between'>
                <h3 className='text-md text-gray-800'>Platform Commission</h3>
                {/*<BiDotsHorizontalRounded className='cursor-pointer Icon' size={20}/>*/}
              </div>
              <h1 className="text-3xl font-semibold">
                <sup className="text-sm align-super mr-1">Ksh</sup>
                <CountUp
                  end={commission}
                  duration={1.5}
                  separator=','
                  decimal={0}
                />
              </h1>
              <p className='text-sm flex items-center gap-2 text-[#787777]'>
                {commissionIncrease ? (
                  <FaArrowTrendUp className='text-green-400'/>
                ) : (
                  <FaArrowTrendDown className='text-red-500'/>
                )}

                <span 
                  className={
                    commissionIncrease
                      ? 'text-green-400'
                      : 'text-red-500'
                  }
                  >
                    {adminAnalytics?.hasCurrentCommission ? (
                      <span className='flex items-center gap-4'>
                        <span className=''>
                          {commissionIncrease ? '+' : '-'}
                          {Math.abs(commissionTrend)}%
                        </span>
                        <span className='text-[#787777]'>
                          from last month
                        </span>
                      </span>
                    ) : (
                      'No commission this month'
                    )}
                  </span>
              </p>
            </div>
          </div>
          <AnimatePresence mode='wait'>
            <motion.div 
              initial={{opacity: 0, scale: 0.95}}
              animate={{ opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.95}}
              transition={{duration: 0.3}}
              className='grid grid-cols-2 gap-2 my-1 p-1 overflow-y-auto overflow-x-hidden PaymentChart'>
              <div className='rounded-xl border-2 border-gray-300 p-2 flex flex-col gap-1 paymentsReq'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-md font-semibold underline text-dark my-2'>Payment requests</h1>
                  {/*<BsThreeDots className='cursor-pointer Icon' size={20}/>*/}
                </div>
                {/*}<div className='relative flex w-full py-2 h-[52px] PayIn'>
                  <input
                    type='text'
                    placeholder='search for payment requests'
                    required
                    className='w-full p-2 border-[1.5px] border-gray-400 rounded-md focus:outline-none focus:border-orange-400'
                  />
                  <span
                    className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-700'
                  >
                    <IoIosSearch className='Icon' size={20}/>
                  </span>
                </div>*/}
                <div className='flex flex-col gap-2 h-full overflow-y-auto pr-1 PayItems'>
                  {paymentLoading && (
                    <div className='h-full text-center text-gray-500 flex flex-col justify-center items-center gap-2'>
                      <MdOutlinePayments className='text-gray-500 text-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer' size={65} />
                      <p className='text-gray-500 text-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer'>Loading payments...</p>
                    </div>
                  )}

                  {paymentError && (
                    <div className='h-full text-center text-gray-500 flex flex-col justify-center items-center gap-2'>
                      <CiCreditCardOff className='text-red-500' size={65} />
                      <p className='text-red-500'>Failed to load  payment requests!</p>
                    </div>
                  )}

                  {!paymentLoading && !paymentError && (
                    paymentRequests?.length > 0 ? (
                      paymentRequests.map((item) => (
                        <PaymentItem
                          key={item?._id}
                          payment={item}
                          setOpenMenuId={setOpenMenuId}
                          openMenuId={openMenuId}
                          handleView={handleView}
                          handleApprove={handleApprove}
                          handleReject={handleReject}
                        />
                      ))
                    ) : (
                      <div className='h-full flex flex-col justify-center items-center text-center text-gray-500 gap-2'>
                        <PiContactlessPaymentFill className='text-red-500' size={65} />
                        <p className='text-base text-gray-600'>
                          No payment requests yet!
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-2 min-h-[260px]'>
                <div className='bg-white rounded-xl p-2 shadow-sm w-full charts01'>
                  <h3 className='text-sn font-medium mb-3'>Revenue</h3>
                  <RevenueChart 
                    data={adminAnalytics?.monthlyRevenue || []
                  }
                  />
                </div>
                {/*<div className='bg-white rounded-xl p-2 shadow-sm w-full'>
                  <h3 className='text-sn font-medium mb-3'>Sales Report</h3>
                  <SalesChart />
                </div>*/}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className='flex flex-col gap-2 my-2 overflow-y-auto overflow-x-hidden salesContainer'>
          <div className='bg-white rounded-xl p-2 shadow-sm w-full overflow-hidden salesRev'>
            <div className='flex flex-col gap-2 px-4'>
            <h3 className='text-md font-medium text-center'>Total Sales Report</h3>
            <hr className='flex-1 border-t border-gray-300' />
            </div>
            <SalesChart 
              data={adminAnalytics}
            />
            <p className='text-muted text-center mb-2'>
              Overview of how key performance metrics are distributed
            </p>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='flex items-center gap-1 Ctext'>
                <span className='flex items-center rounded-md bg-[#22c55e] p-2'></span>
                <span className='text-sm text-muted'>Products sold</span>
              </div>
              <div className='flex items-center gap-1 Ctext'>
                <span className='flex items-center rounded-md bg-[#84cc16] p-2'></span>
                <span className='text-sm text-muted'>Orders</span>
              </div>
              {/*<div className='flex items-center gap-1 Ctext'>
                <span className='flex items-center rounded-md bg-[#fbbf24] p-2'></span>
                <span className='text-sm text-muted'>Products</span>
               </div>*/}
            </div>
          </div>
          <div className='p-3 rounded-xl bg-muted vendors'>
            <h1 className=''>Vendor Approvals</h1>
            <div className='flex flex-col gap-2 pr-1 vendorItem'>
              {isLoading ? (
                <p className='text-dark'> loading vendor approvals...</p>
              ) : isError ? (
                <p className='text-dark text-sm  mt-2 flex flex-col justify-center items-center gap-2'>
                  <MdOutlineErrorOutline className='text-red-500' size={45} />
                  Failed to load vendor approvals
                </p>
              ) : (
                data.length === 0 ? (
                <p className='text-dark text-sm  mt-2 flex flex-col justify-center items-center gap-2'>
                  <MdOutlineProductionQuantityLimits className='text-red-500' size={45} />
                  No vendors awaiting approval
                </p>
              ) : (
                data.slice(0, 3).map((vendor) => (
                  <div
                    key={vendor._id}
                    className='relative flex justify-between items-center'
                  >
                    <p className='rounded-full items-center p-1 text-xs text-white bg-dark'>
                      {getFirstTwoChars(vendor.storeName || vendor.email)}
                    </p>

                    <div className='flex flex-col gap-1'>
                      <p className='text-xs font-medium text-dark'>
                        {vendor.storeName || 'No store name'}
                      </p>
                      <p className='text-[#525151] text-xs'>
                        {vendor.email}
                      </p>
                    </div>

                    <BsThreeDotsVertical
                      onClick={() => setOpenVendorMenuId(
                        openVendorMenuId === vendor?._id ? null : vendor?._id
                      )}
                      className='cursor-pointer Icon'
                      size={20}
                    />

                    <AnimatePresence>
                      {openVendorMenuId === vendor?._id && (
                        <motion.div
                          ref={vendorRef}
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className='absolute right-8 top-8 z-50 flex flex-col rounded-lg border-[1.3px] border-gray-400 bg-white shadow-lg overflow-hidden'
                          >
                            <button
                              onClick={() => openVendorModal(vendor)}
                              className='cursor-pointer w-fit text-left px-4 py-2 hover:bg-gray-100'
                              >
                              View
                            </button>
                            <button
                              disabled={isActionLoading(vendor?._id)}
                              onClick={() => handleVendorActions(
                                vendor?._id,
                                'approve'
                              )}
                              className='cursor-pointer w-fit text-left px-4 py-2 text-green-600 hover:bg-green-50'
                              >
                              Approve
                            </button>
          
                            <button
                              disabled={isActionLoading(vendor._id)}
                              onClick={() => openRejectionModal(vendor)}
                              className='cursor-pointer w-fit text-left px-4 py-2 text-red-600 hover:bg-red-50'
                              >
                              Reject
                            </button>
                          </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>

        <AdminReqModals
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
            setModalType(null)
          }}
          request={selectedRequest}
          type={modalType}
          onReject={(rejectionReason) => 
            rejectWithdrawalRequest.mutateAsync({
              withdrawalId: selectedRequest._id,
              rejectionReason,
            })
          }
        />

        <RejectVendorModal
          isOpen={rejectionModal}
          vendor={selectedVendor}
          onClose={() => {
            setRejecionModal(false)
            setSelectedVendor(null);
          }}
          isSubmitting={
            selectedVendor ? isActionLoading(selectedVendor?._id) : false
          }
          onReject={async (reason) => {
            await handleVendorActions(
              selectedVendor?._id,
              'reject',
              reason
            );

            setRejecionModal(false);
            setSelectedVendor(null);
          }}
        />

        <VerifyDoc
          isOpen={verifyModal}
          onClose={() => {
            setVerifyModal(false);
            setSelectedVendorId(null);
          }}
          title= {`Verification documents for ${selectedVendor?.storeName}`}
          >
            {vendorVerificationQuery.isLoading ? (
              <p>Loading docs...</p>
            ) : vendorVerificationQuery.isError ? (
              <p className='text-red-600'>Failed to load documents</p>
            ): vendorVerificationQuery.data?.verificationFiles?.length > 0 ? (
              <div className='flex flex-col gap-2'>
                <div className='grid grid-cols-2 gap-2 verifyImg '>
                  {vendorVerificationQuery.data.verificationFiles.map((file, idx) => (
                    <img 
                      key={idx}
                      src={file.url}
                      className='w-full h-32 object-cover rounded verImg'
                    />
                  ))}
                </div>

                <div className='bg-gray-100 p-3 rounded-lg'>
                  <p className='text-sm text-gray-500 AppSign'>Signature</p>
                  <p className='text-dark font-medium wrap-break-words'>
                    {vendorVerificationQuery.data.signature}
                  </p>
                </div>
                
                <div className='bg-gray-100 p-3 rounded-lg'>
                  <p className='text-sm text-gray-600'>Terms & Conditions</p>
                  <p className={`font-medium ${vendorVerificationQuery.data.termsConditions 
                    ? 'text-green-600'
                    : 'text-red-600'
                    }`}>
                      {vendorVerificationQuery.data.termsConditions
                        ? 'Accepted'
                        : 'Note Accepted'
                      }
                    </p>
                </div>
              </div>
            ) : (
              <p className=''> No documents uploaded by this vendor</p>
            )}
            
        </VerifyDoc>
      </div>
    </>
  )
}

export default OverviewTab