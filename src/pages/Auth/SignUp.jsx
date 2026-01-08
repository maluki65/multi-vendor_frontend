import React, { useState } from 'react';
import './Auth.css';
import { Inner } from '../../commons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SIbc01, SIbc02 } from '../../assets';
import { FaStarOfLife } from "react-icons/fa";
import VendorSign from './VendorSign';
import BuyerSign from './BuyerSign';
import { Autoplay, Pagination, Navigation, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';
import { Swiper, SwiperSlide } from 'swiper/react'
import { SignSwipper } from '../../commons';
import { SignSwipperItems } from '../../components';

function SignUp() {
  const [activeTab, setActiveTab] = useState('Buyer');

  const menu =[ 'Buyer', 'Vendor' ];

  const navigate = useNavigate();
  return (
    <Inner>
      <section className='min-h-screen overflow-hidden p-1.5 flex items-center justify-center w-full'>
        <div className='w-full grid grid-cols-2  justify-center items-center gap-4 signCon'>
          <div
            className='h-[97vh] w-full rounded-3xl relative signImg'
            style={{
              backgroundImage: `url(${SIbc02})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className='inset-0 absolute text-light flex p-4 bg-black/40 rounded-3xl'>
              <div className='flex flex-col items-start justify-between'>
                <FaStarOfLife className='text-white cursor-pointer animate-spin left-3 icon' size={30}/>
                <div className='bottom-3 w-94 mx-auto swiperClass'>
                  <Swiper
                    spaceBetween={0}
                    autoplay={{
                      delay: 3500,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={false}
                    modules={[Autoplay, Pagination, Navigation]}
                    className='mySwiper00100 w-full'>
                      {SignSwipper.map((item, index) => (
                        <SwiperSlide key={index}>
                          <SignSwipperItems signItem={item}/>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                </div>
              </div>
            </div>
          </div>
          <div>
          <div className='flex justify-center gap-2 items-center signText'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-2xl font-semibold font-sans create'> Create an account as a</h2>
              <div className='flex justify-center gap-4'>
                {menu.map((item, index) => (
                  <button
                    key={index}
                    className={`text-dark cursor-pointer ${activeTab == item ? 'font-bold text-orange-500 underline' : ''} menu`}
                    onClick={() => setActiveTab(item)}
                    >
                      {item}
                  </button>
                ))}
              </div>
            </div>
            </div>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'Buyer' ? <BuyerSign/> : <VendorSign/>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </Inner>
  )
}

export default SignUp