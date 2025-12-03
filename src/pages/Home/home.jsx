import React from 'react'
import './home.css';
import { useNavigate } from 'react-router-dom';
import { Inner } from '../../commons';
import { Navabar } from '../../components';
import { round01, round02, round03 } from '../../assets';
import { HeroCardItem } from '../../components';
import { HeroCards } from '../../commons';


function home() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/register')
  }

  return (
    <Inner>
      <Navabar/>
      <section className='relative min-h-[70vh] px-[4%] pt-3.5 flex flex-col gap-1 my-4.5 '>
        <div className='grid grid-cols-[60%_40%] gap-5'>
          <h1 className='text-5xl font-thin tracking-wide font-sans text-[#383636]'>Discover quality products from <span className='font-bold text-dark'>trusted </span>vendors—shipped sustainably <span>→</span> <span className='rounded-full text-light p-1 bg-secondary text-base cursor-pointer text-center' onClick={handleNavigate}>Get started</span>
          </h1>
          <div className='flex flex-col gap-2 items-end px-2.5 justify-center'>
            <div className='flex flex-col justify-center'>
              <div className='flex items-center space-x-1 my-2'>
                <div className='flex -space-x-2'>
                  <img src={round01} alt='user' className='w-12 h-12 rounded-full '/>
                  <img src={round02} alt='user' className='w-12 h-12 rounded-full '/>
                  <img src={round03} alt='user' className='w-12 h-12 rounded-full '/>
                  <p className='w-12 h-12 rounded-full text-center bg-white flex items-center justify-center text-[#636363]'>+</p>
                </div>
              </div>
              <div className='flex flex-col gap-1 px-4.5 '>
                <h2 className='font-bold'>500<span className='text-xs font-semibold'></span>+</h2>
                <p className='text-[#8b8989] text-base'> Happy Customers</p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-[40%_30%_30%] gap-2 my-12'>
          {HeroCards.slice(0, 3).map((items, index) => {
            return (
              <div key={index}>
                <HeroCardItem heroCard={items}/>
              </div>
            )
          })}
        </div>
      </section>
    </Inner>
  )
}

export default home