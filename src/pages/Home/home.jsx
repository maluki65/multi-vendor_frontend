import React from 'react'
import './home.css';
import { useNavigate } from 'react-router-dom';
import { GoNorthStar } from "react-icons/go";
import { Autoplay, Pagination, Navigation, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';
import { Link } from 'react-router-dom';
import { Inner } from '../../commons';
import { Navabar, HeroCardItem, ProdCardItem, BannerCardItems, ProductItems, TestimonialItems, Footer } from '../../components';
import { HeroCards, ProdCards, BannerCards, ProductCards, Testimonials } from '../../commons';
import { round01, round02, round03, Create, WYellow, WPink, Hand, wSec01, wSec02, wSec03, wSec04, wSec05, wSec06, wSec07, wSec011, wSec012, wSec013  } from '../../assets';
import { Swiper, SwiperSlide } from 'swiper/react'


function home() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/register')
  }

  const ProductCategory = [
    { name: 'Shoes', link: '/' },
    { name: 'Clothing', link: '/' },
    { name: 'Accessories', link: '/' },
    { name: 'Jewellery', link: '/' }
  ];

  return (
    <Inner>
      <Navabar/>
      <section className='min-h-[70vh] px-[4%] pt-3.5 flex flex-col gap-1 overflow-hidden HeroC'>
        <div className='grid grid-cols-[60%_40%] gap-5 HContainer'>
          <h1 className='text-5xl font-thin tracking-wide font-sans text-[#383636]'>Discover quality products from <span className='font-bold text-dark'>trusted </span>vendors—shipped sustainably <span>→</span> <span className='rounded-full text-light p-1 bg-secondary text-base cursor-pointer text-center started' onClick={handleNavigate}>Get started</span>
          </h1>
          <div className='flex flex-col gap-2 items-end px-2.5 justify-center HICon'>
            <div className='flex flex-col justify-center'>
              <div className='flex items-center space-x-1 my-2 HImg'>
                <div className='flex -space-x-2'>
                  <img src={round01} alt='user' className='w-12 h-12 rounded-full '/>
                  <img src={round02} alt='user' className='w-12 h-12 rounded-full '/>
                  <img src={round03} alt='user' className='w-12 h-12 rounded-full '/>
                  <p className='w-12 h-12 rounded-full text-center bg-white flex items-center justify-center text-[#636363]'>+</p>
                </div>
              </div>
              <div className='flex flex-col gap-1 px-4.5 Hp'>
                <h2 className='font-bold'>500<span className='text-xs font-semibold'></span>+</h2>
                <p className='text-[#8b8989] text-base'> Happy Customers</p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-[40%_30%_30%] gap-2 my-12 HCards'>
          {HeroCards.slice(0, 3).map((items, index) => {
            return (
              <div key={index}>
                <HeroCardItem heroCard={items}/>
              </div>
            )
          })}
        </div>
      </section>

      <section className='min-h-[50vh] my-1.5 px-[4%] overflow-hidden ProdCon' id='Products'>
        <div className='grid grid-cols-[70%_30%] gap-3 my-2 PTContainer'>
          <div className='flex flex-col gap-3'>
            <button className='rounded-full py-1 px-2 bg-transparent text-dark font-sans border border-dark cursor-pointer w-fit text-sm'>
             Browse Full Collection
            </button>
            <h1 className='text-4xl font-sans w-[50%] Ptext'>
             The Products Everyone’s Falling For
            </h1>
          </div>
          <div className='flex flex-col  gap-3 justify-center Prod'>
            <p className='text-[#383636] font-sans '>
              A curated list of the top-chosen products—celebrated for quality, value, and the stories they bring into people’s lives.
            </p>
            <button className='rounded-full py-1 px-2 bg-transparent text-dark font-sans border font-semibold border-dark cursor-pointer w-fit text-sm'>
             Shop Now
            </button>
          </div>
        </div>
        <div className='my-2 grid grid-cols-2 md:grid-cols-4 gap-2 justify-end items-end'>
          {ProdCards.map((item, index) => {
            return (
              <div key={index}>
                <ProdCardItem prodCard={item}/>
              </div>
            )
          })}
        </div>
      </section>

      <section className='min-h-[60vh] my-16 px-[4%] overflow-hidden flex flex-col gap-10' id='About'>
        <div className='flex justify-center'>
          <h1 className="text-6xl text-dark font-sans NPText ">
            <span className="flex items-start gap-2">
              <span className="bg-[#ebe7e7] rounded-full p-1 text-dark animate-spin"><GoNorthStar size={30}/></span>
              <span>Supercharging Merchants</span>
            </span>

            <span className="flex indent-12">
              <span>and Vendors for</span>
              <span className="text-primary">
               →
              </span>
            </span>

            <span className="block indent-20">Maximum Profit</span>
          </h1>
        </div>
        <div className='grid grid-cols-2 gap-4 Sec02'>
          <div className='flex flex-col gap-2 justify-center'>
            <h2 className='text-dark font-sans font-semibold'>
              A Unified Marketplace Built for Growth
            </h2>
            <p className='text-base tracking-tight font-sans'>
             Our platform connects servide providers, suppliers, and vendors in a seamless digital ecosystem designed to simplify trade and increase profitability. From modern tools to trusted logistics and secure payments, we provide everything you need to grow your business with confidence.
            </p>
          </div>
          <img  src={Create} className='rounded-md h-[400px] w-full object-cover'/>
        </div>
      </section>

      <section className='min-h-[60vh] my-16 px-[4%] overflow-hidden flex flex-col gap-4 justify-center wSec'>
        <div className='grid grid-cols-2 gap-3 wCSec'>
          <img 
            src={wSec05}
            loading='lazy'
            className='rounded-xl h-[450px] w-full object-fit'
          />
          <div className='min-h-[450px] bg-[#ebe7e7] rounded-xl py-2 px-2.5'>
            <h1 className='text-2xl text-dark font-sans'>
              Why Choose Us
            </h1>
            <p className='text-[#303030] my-1.5'>
             We bring together trusted vendors, unbeatable prices, and a seamless shopping experience—all in one place. Enjoy faster delivery, verified sellers, and a platform designed to make every purchase simple, secure, and rewarding.
            </p>
            <div className="space-y-4 " id='Why Us'>
              <details className="group [&_summary::-webkit-details-marker]:hidden transition ease-in duration-700 ">
                  <summary
                      className="flex items-center justify-between gap-1 rounded-md p-1"
                  >
                      <h2 className="text-lg   cursor-pointer text-[#070707] hover:underline font-medium">Unrivaled Quality</h2>

                      <svg
                      className="size-5 shrink-0 transition-transform cursor-pointer duration-300 text-[#070707] group-open:-rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                  </summary>

                  <p className="px-1 pt-1  text-[#303030]">
                    Premium standards that deliver performance you can trust.
                  </p>
              </details>
              <hr className='my-[5px] h-[1.5px]  bg-[#e4e2e21a]'/>
              <details className="group [&_summary::-webkit-details-marker]:hidden transition ease-in duration-700 " open>
                  <summary
                      className="flex items-center justify-between gap-1 rounded-md p-1"
                  >
                      <h2 className="text-lg   cursor-pointer text-[#070707] hover:underline font-medium">Customer-First Approach</h2>

                      <svg
                      className="size-5 shrink-0 transition-transform cursor-pointer duration-300 text-[#070707] group-open:-rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                  </summary>

                  <p className="px-1 pt-1  text-[#303030]">
                   Service tailored around your needs, goals, and experience.
                  </p>
              </details>
              <hr className='my-[5px] h-[1.5px]  bg-[#e4e2e21a]'/>
              <details className="group [&_summary::-webkit-details-marker]:hidden transition ease-in duration-700 ">
                  <summary
                      className="flex items-center justify-between gap-1 rounded-md p-1"
                  >
                      <h2 className="text-lg   cursor-pointer text-[#070707] hover:underline font-medium">Trusted by Thousands</h2>

                      <svg
                      className="size-5 shrink-0 transition-transform cursor-pointer duration-300 text-[#070707] group-open:-rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                  </summary>

                  <p className="px-1 pt-1  text-[#303030]">
                   A reputation strengthened by real people, real stories, and real success.
                  </p>
              </details>
              <hr className='my-[5px] h-[1.5px]  bg-[#e4e2e21a]'/>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-[1fr_1fr_1fr_2fr] gap-2 WSCards'>
          <div className='flex flex-col gap-2 rounded-md bg-amber-200 p-2 space-y-2'>
            <h2 className='text-xl'>
             100% Genuine Products
            </h2>
            <p className='text-[#747474] text-sm'>
             Sourced directly to guarantee originality and long-lasting quality you can trust.
            </p>
            <button className='border-[1.5px] rounded-full text-dark text-sm cursor-pointer p-1 w-fit self-end'>
              See More
            </button>
          </div>
          <div className='flex flex-col gap-2 rounded-md bg-[#ebe7e7] p-2 space-y-2'>
            <h2 className='text-xl'>
             Enjoy Free & Simple Returns
            </h2>
            <p className='text-[#747474] text-sm'>
             Return or exchange with zero stress, thanks to our simple and customer-friendly process.
            </p>
            <button className='border-[1.5px] rounded-full text-dark text-sm cursor-pointer p-1 w-fit self-end'>
              See More
            </button>
          </div>
          <div className='flex flex-col gap-2 rounded-md bg-[#ebe7e7] p-2 space-y-2'>
            <h2 className='text-xl'>
             Safe & Encrypted Checkout
            </h2>
            <p className='text-[#747474] text-sm'>
             Your transactions are fully protected with secure, encrypted payment technology.
            </p>
            <button className='border-[1.5px] rounded-full text-dark text-sm cursor-pointer p-1 w-fit self-end'>
              See More
            </button>
          </div>
          <div className='relative bg-center rounded-md' style={{ backgroundImage: `url(${wSec03})`}}>
            <div className='absolute inset-0 flex items-end p-2.5 justify-between'>
              <h2 className='text-white text-xl font-bold'>
                Everyday <br/> Wear
              </h2>
              <p className='bg-orange-500 h-32 w-32 flex items-center justify-center text-white gap-1 star' style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 68%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}>10% <span className=''>
              OFF</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className='min-h-[50vh] my-12 px-[4%] overflow-hidden '>
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
         className='mySwiper'>
         {BannerCards.map((item, index) => (
          <SwiperSlide key={index}>
            <BannerCardItems banner={item}/>
          </SwiperSlide>
         ))}
         </Swiper>
      </section>

      <section className='min-h-[60vh] my-12 px-[4%] overflow-hidden' id='Products'>
        <div className='flex flex-col gap-3 justify-start pHeading'>
          <h1 className='text-dark text-4xl font-sans font-semibold'>
            Our All Products
          </h1>
          <p className='text-[#5c5b5b] text-base w-[35%]'>
            These products can rotate weekly or based on seasonality and demand.
          </p>
          <div className='flex gap-2 PBtn'>
            {ProductCategory.map((item, index ) => {
              return (
                <button key={index}>
                  <Link
                    to={item.link}
                    className='text-[#5c5b5b] text-base rounded-full border-[1.5px] border-[#5c5b5b] py-1 px-2'>
                      {item.name}
                    </Link>
                </button>
              )
            })}
          </div>
        </div>
        <div className='grid grid-cols-3 gap-3 my-4 justify-center items-center PCSection'>
          {ProductCards.map((items, index) => {
            return (
              <div key={index}>
                <ProductItems product={items} />
              </div>
            )
          })}
        </div>
      </section>

      <section className='min-h-[40vh] mt-12 px-[4%] bg-gray-50 py-8 overflow-hidden' id='Testimonials'>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex flex-col justify-center gap-1 my-6 TSheadings'>
            <h2 className='text-center text-bold text-muted text-xs uppercase'>
              Testimonials
            </h2>
            <h1 className='text-dark text-3xl text'>
              What our users say about us!
            </h1>
          </div>
          <Swiper
            effect="cards"
            grabCursor={true}
            modules={[EffectCards, Autoplay]}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            navigation={false}
            className='w-[520px] mySwiper'
          >
            {Testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <TestimonialItems testimonial={item}/>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <Footer/>
    </Inner>
  )
}

export default home