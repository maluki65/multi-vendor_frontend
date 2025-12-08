import React from 'react'
import './home.css';
import { useNavigate } from 'react-router-dom';
import { GoNorthStar } from "react-icons/go";
import { Inner } from '../../commons';
import { Navabar } from '../../components';
import { round01, round02, round03, Create, WYellow, WPink, Hand, wSec01, wSec02, wSec03, wSec04, wSec05, wSec06, wSec07 } from '../../assets';
import { HeroCardItem, ProdCardItem } from '../../components';
import { HeroCards, ProdCards } from '../../commons';


function home() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/register')
  }

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
          <h1 class="text-6xl text-dark font-sans NPText ">
            <span class="flex items-start gap-2">
              <span class="bg-[#ebe7e7] rounded-full p-1 text-dark animate-spin"><GoNorthStar size={30}/></span>
              <span>Supercharging Merchants</span>
            </span>

            <span class="flex indent-12">
              <span>and Vendors for</span>
              <span class="text-primary">
               →
              </span>
            </span>

            <span class="block indent-20">Maximum Profit</span>
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

      <section className='min-h-[60vh] my-16 px-[4%] overflow-hidden flex flex-col gap-4 justify-center'>
        <div className='grid grid-cols-2 gap-3'>
          <img 
            src={wSec05}
            loading='lazy'
            className='rounded-xl h-[450px] w-full object-fit'
          />
          <div className='min-h-[450px] bg-[#ebe7e7] rounded-xl px-2 py-2.5'>
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
              <details className="group [&_summary::-webkit-details-marker]:hidden transition ease-in duration-700 ">
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
      </section>
    </Inner>
  )
}

export default home