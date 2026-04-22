import React, { useState, useEffect } from 'react';
import '../BuyerTabs.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react'
import { ReactLenis } from 'lenis/react';
import { HomeSwiperItems } from '../../';
import { useNavigate } from 'react-router-dom';
import useProducts from '../../../Hooks/useProduts';
import DashProducts from '../../../commons/Data/DashSwiper';
import BuyerWhy from '../../../commons/Data/BuyerWhy';
import ProductCard from '../BuyerItems/productCard';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import ProductSkeleton from '../BuyerItems/productSkeleton';
import { Axis, fan, vision, hp, Tv, Lazuli, Sub } from '../../../assets';
import BuyerCategories from '../../../commons/Data/BuyerCategories';
import { MdArrowRightAlt } from "react-icons/md";
import { Footer } from '../../';

function BuyerDashboard() {
  const [startIndex, setStartIndex] = useState(0);
  //const [showLoader, setShowLoader] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

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


  /*useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 10000); 

    return () => clearTimeout(timer);
  }, []);*/

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
                    <Icon size={32} className='text-orange-400 wHyIcons'/>
                  </div>
                  <div className='flex flex-col whyText'>
                    <h1 className='font-semibold itemHeading'>
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

        <section className='min-h-[30vh] px-[2%] my-10 overflow-hidden flex flex-col bg-gray-100 pb-8'>
          <h2 className='font-semibold text-xl flex items-center gap-1 mb-4 pdosC'>
            <span className='underline decoration-secondary decoration-2 underline-offset-4'>
              Latest
            </span>
            <span>Products</span>
          </h2>

          <div className='flex justify-end gap-2 items-center mb-3'>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={handlePrev}
              className='px-3 py-1  cursor-pointer rounded disabled:opacity-50'
              disabled={startIndex === 0}
            >
              <FaChevronLeft className='' />
            </motion.button >

            <motion.button 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={handleNext}
              className='px-3 py-1  cursor-pointer rounded disabled:opacity-50'
              disabled={startIndex + itemsPerPage  >= data?.products?.length}
            >
              <FaChevronRight className='' />
            </motion.button>
          </div>

          {isLoading ? (
            <motion.div
              className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'
               >
                {Array.from({ length: 5 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
               </motion.div>
          ): (
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className='relative'
                      >
                      {!product && (
                        <div className='absolute inset-0 z-10'>
                          <ProductSkeleton />
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    </motion.div>
                  ))}
              </motion.div>
          </AnimatePresence>
          )}

        </section>

        <section className='min-h-[30vh] px-[2%] my-10 flex flex-col overflow-hidden catCon89'>
          <div className='grid grid-cols-[70%_30%] gap-2 catTitles'>
            <h1 className='text-6xl font-semibold catHead'>From Streets to Screens: Your Marketplace, Anywhere</h1>
            <p className='text-gray-500 text-left pt-7 catPara'>
             Step into a world where the energy of local markets meets the convenience of digital shopping. Explore top products, compare prices, and connect with trusted vendors—all from your screen, anytime and anywhere.
            </p>
          </div>
          <div className='grid grid-cols-[30%_70%] gap-3 min-h-[30vh] mt-4 p-2 cat908'>
            <div className='flex flex-col bg-gray-100 rounded-md overflow-hidden'>
              <img 
                src={fan}
                loading='lazy'
                className='h-75 onbject-contain rotate-6 mb-3'
              />
              <div className='flex flex-col justify-end gap-2 p-3 mt-3'>
                <h2 className='text-2xl font-medium'>High-Performance Gaming PCs</h2>
                <p className='text-gray-500 text-sm'>
                 Discover powerful desktop systems built for speed, performance, and immersive gaming. Compare specs, prices, and trusted vendors
                </p>
              </div>
            </div>
            <div className='flex flex-col gap-3 h-full'>
              <div className='bg-gray-100 rounded-md h-[50%] p-2 flex flex-2/3'>
                <div className='flex flex-1/2 gap-2 fanImgs'>
                  <div className='flex flex-col justify-end gap-3'>
                    <h2 className='text-2xl font-medium'>Virtual Reality Experiences</h2>
                    <p className='text-gray-500 text-sm'>
                     Step into the future with cutting-edge VR headsets. Explore immersive worlds and shop top-rated devices from verified sellers.
                    </p>
                  </div>
                  <img 
                    src={vision}
                    loading='lazy'
                    className='h-75 onbject-contain rotate-30 mb-3'
                  />
                </div>
              </div>
              <div className='grid h-[50%] grid-cols-2 gap-3 catLastCon'>
                <div className='rounded-md items-center justify-center bg-gray-100 p-2 flex flex-1/2  fanImgs'>
                  <div className='flex flex-col justify-start gap-3'>
                    <h2 className='text-2xl font-medium'>Smart Laptops & Tablets</h2>
                    <p className='text-gray-500 text-sm'>
                     Browse versatile laptops and 2-in-1 devices perfect for work, study, and creativity. Find the best deals from multiple vendors.
                    </p>
                  </div>
                  <img 
                    src={hp}
                    loading='lazy'
                    className='h-45 onbject-contain rotate-6 mb-3 flex justify-end'
                  />
                </div>
                <div className='rounded-md bg-gray-100 p-2 flex flex-1/2 overflow-hidden fanImgs'>
                  <div className='flex flex-col justify-start gap-3'>
                    <h2 className='text-2xl font-medium'>Gaming & Mechanical Keyboards</h2>
                    <p className='text-gray-500 text-sm'>
                     Upgrade your setup with responsive, customizable keyboards designed for performance and comfort.
                    </p>
                  </div>
                  <img 
                    src={Axis}
                    loading='lazy'
                    className='h-45 onbject-contain rotate-6 mb-3 flex justify-end overImg'
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='min-h-[30vh] px-[2%] my-6 flex flex-col gap-4 overflow-hidden catCon001'>
          <div className='flex items-center justify-between CatTexts001'>
            <h2 className='font-semibold text-xl flex items-center gap-1 mb-4 pdosC'>
              <span className='underline decoration-secondary decoration-2 underline-offset-4'>
                Shop
              </span>
              <span>By Categories</span>
            </h2>

            <a 
              onClick={() => navigate('/buyer/products')}
              className='text-base cursor-pointer text-dark hover:text-primary hover:underline'>
              view all products
            </a>
          </div>

          <div className='grid grid-cols-7 gap-2 CanCards'>
            {BuyerCategories.map((category) => (
              <div key={category.id} className='flex flex-col gap-2'>
                <div className='rounded-md h-[150px] CatImg001'>
                  <img
                    src={category.img}
                    alt={category.name}
                    loading='lazy'
                    className='h-full w-full rounded-md objec-cover CatImg002'
                  />
                </div>
                <div className='p-2 flex flex-col items-center justify-center'>
                  <h4 className='font-medium text-base test-dark flex items-center'>
                    {category.name}
                    <MdArrowRightAlt className='' />
                  </h4>
                  <p className='text-muted text-base'>
                    {category.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='min-h-[40vh] px-[2%] my-6 flex flex-col gap-4 overflow-hidden'>
          <div className='bg-yellow-100 flex flex-1/2 gap-2 items-center justify-center rounded-md Subscribe'>
            <div className='flex flex-col gap-2 p-2'>
              <p className='text-muted text-sm'>
                Stay updated!
              </p>
              <h2 className='text-dark font-semibold text-4xl capitalize'>
                subscribe to the news
              </h2>
              <p className='text-muted text-base'>
               Stay updated with the latest news, trends, and exclusive updates delivered straight to your inbox.
              </p>
              <button 
                className='px-2 py-1 border text-base rounded cursor-pointer w-fit hover:border-primary hover:text-secondary'>
                  Subscribe
              </button>
            </div>
            <div className='h-[300px] px-3 SubImg'>
              <img
                src={Sub}
                alt='Subscribe'
                className='h-full w-full object-cover'
              />
            </div>
          </div>
        </section>

        <div className='p-2'>
         <Footer />
        </div>
      </ReactLenis>
    </>

  )
}

export default BuyerDashboard