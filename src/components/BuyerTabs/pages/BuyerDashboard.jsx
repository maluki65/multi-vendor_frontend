import React, { useState, useEffect } from 'react';
import '../BuyerTabs.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react'
import { ReactLenis } from 'lenis/react';
import { HomeSwiperItems } from '../../';
import useProducts from '../../../Hooks/useProduts';
import DashProducts from '../../../commons/Data/DashSwiper';
import BuyerWhy from '../../../commons/Data/BuyerWhy';
import ProductCard from '../BuyerItems/productCard';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

function BuyerDashboard() {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { getAllProducts } = useProducts();
  const { data, isLoading, isError } = getAllProducts({
    page: 1,
    limit: 20
  });

  useEffect(() => {
    const handleReSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(2); 
      } else if (width < 768) {
        setItemsPerPage(3); 
      } else if (width < 1024) {
        setItemsPerPage(4); 
      } else {
        setItemsPerPage(5); 
      }
    };

    handleReSize();
    window.addEventListener('resize', handleReSize);

    return () => window.removeEventListener('resize', handleReSize);
  }, []);

  useEffect(() => {
    setStartIndex(0);
  }, [itemsPerPage]);

  const visibleProducts = data?.products?.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  
  const handleNext = () => {
    if (startIndex + itemsPerPage < data?.products.length){
      setStartIndex(prev => prev + itemsPerPage);
    }
  }

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0){
      setStartIndex(prev => prev - itemsPerPage);
    }
  };

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

        <section className='min-h-[30vh] px-[2%] my-6 overflow-hidden flex flex-col bg-gray-100 p-2'>
          <h2 className="font-semibold text-xl flex items-center gap-1 mb-4">
            <span className="underline decoration-secondary decoration-2 underline-offset-4">
              Latest
            </span>
            <span>Products</span>
          </h2>

          <div className='flex justify-end gap-2 items-center mb-3'>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={handlePrev}
              className='px-3 py-1 bg-gray-300 cursor-pointer rounded disabled:opacity-50'
              disabled={startIndex === 0}
            >
              <FaChevronLeft className='' />
            </motion.button >

            <motion.button 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={handleNext}
              className='px-3 py-1 bg-gray-300 cursor-pointer rounded disabled:opacity-50'
              disabled={startIndex + itemsPerPage  >= data?.products?.length}
            >
              <FaChevronRight className='' />
            </motion.button>
          </div>

          <AnimatePresence mode='wait'>
            <motion.div 
             key={startIndex}
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -50 }}
             transition={{ duration: 0.4 }}
             className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
              {visibleProducts?.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  >
                 <ProductCard  product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

        </section>
      </ReactLenis>
    </>

  )
}

export default BuyerDashboard