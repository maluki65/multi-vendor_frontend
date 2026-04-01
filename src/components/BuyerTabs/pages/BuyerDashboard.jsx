import React from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import { Autoplay, Pagination, Navigation, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';
import { Swiper, SwiperSlide } from 'swiper/react'
import { ReactLenis } from 'lenis/react';
import { HomeSwiper } from '../../';
import dashProducts from '../../../commons/Data/DashSwiper';

function BuyerDashboard() {

  return (
    <Inner>
      <section className='min-screen bg-gray-100 px-[4%] overflow-hidden'>
        <Swiper
          spaceBetween={0}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false
          }}
          pagination={{
            clickable: true
          }}
          navigation={false}
          modules={({Autoplay, Pagination, Navigation})}
          className='BuyerDashSwiper'></Swiper>
      </section>
    </Inner>
  )
}

export default BuyerDashboard