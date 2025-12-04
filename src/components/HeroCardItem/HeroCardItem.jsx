import React from 'react';
import './HeroCardItem.css';
import { useNavigate } from 'react-router-dom';
import { CiHeart } from "react-icons/ci";

function HeroCardItem({heroCard}) {

  const navigate = useNavigate();

  return (
    <div className='relative rounded-xl h-[300px] bg-red-500 bg-center bg-cover Hcard' style={{ backgroundImage: `url(${heroCard.image})`}}>
      <div className='absolute inset-0 flex flex-col p-2.5 justify-between'>
        <div className='flex justify-between'>
          <p className='p-2 rounded-full bg-amber-50 flex items-center justify-center HCText'>
           <CiHeart className='text-red-500 hover:rotate-x-180' strokeWidth={1}/>
          </p>
          <a className=' rounded-full py-1 px-2 text-center border text-dark text-sm cursor-pointer HCLink'>Buy Now</a>
        </div>
        <div className='bg-amber-50 w-fit rounded-md px-2 py-1 font-Playfair CText'>{heroCard.desc}</div>
      </div>
    </div>
  )
}

export default HeroCardItem