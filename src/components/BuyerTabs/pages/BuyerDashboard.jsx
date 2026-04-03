import React from 'react';
import '../BuyerTabs.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react'
import { ReactLenis } from 'lenis/react';
import { HomeSwiperItems } from '../../';
import useProducts from '../../../Hooks/useProduts';
import DashProducts from '../../../commons/Data/DashSwiper';
import BuyerWhy from '../../../commons/Data/BuyerWhy';

function BuyerDashboard() {
  const { getAllProducts } = useProducts();
  const { data, isLoading, isError } = getAllProducts({
    page: 1,
    limit: 20
  });

  console.log(data);
  console.log(data?.products);
  

  return (
    <>
      <section className='max-h-[90vh] px-[2%] overflow-x-hidden rounded my-2 '>
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
          modules={[Autoplay, Pagination, Navigation]}
          className='BuyerDashSwiperh-full w-full rounded'>
          {DashProducts.map((item) => (
            <SwiperSlide key={item.id}>
              <HomeSwiperItems DashItem={item}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <ReactLenis root>
        <section className='min-h-[10vh] px-[2%] my-6 overflow-hidden'>
          <div className='grid grid-cols-4 bg-blue-100  gap-4 items-center justify-center p-4 rounded-md BuyeWHY'>
            {BuyerWhy.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.heading} className='flex gap-2 items-center justify-center whyBox'>
                  <div className='flex items-center justify-center p-2 rounded bg-blue-300'>
                    <Icon size={32} className='text-orange-400'/>
                  </div>
                  <div className='flex flex-col whyText'>
                    <h1 className='font-semibold'>
                      {item.heading}
                    </h1>
                    <p className='font-normal text-base text-gray-500'>
                      {item.para}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className='min-h-[30vh] px-[2%] my-6 overflow-hidden flex flex-col'>
          <h2 className="font-semibold text-xl flex items-center gap-1">
            <span className="underline decoration-secondary decoration-2 underline-offset-4">
              Latest
            </span>
            <span>Products</span>
          </h2>
        </section>
      </ReactLenis>
    </>

  )
}

export default BuyerDashboard