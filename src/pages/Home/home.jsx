import React from 'react'
import './home.css';
import { useNavigate } from 'react-router-dom';
import { Inner } from '../../commons';
import { Navabar } from '../../components';
import { round01, round02, round03 } from '../../assets';
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

      <section className='min-h-[50vh] my-1.5 px-[4%] overflow-hidden ProdCon'>
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
    </Inner>
  )
}

export default home