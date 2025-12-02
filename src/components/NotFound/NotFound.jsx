import React from 'react';
import { AiOutlineFileSearch } from "react-icons/ai";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';
import fadeIn from '../../commons/variants';
import { Inner } from '../../commons';


function NotFound() {

  const navigate = useNavigate();
  const handleHome = () => {
    navigate('/')
  }

  return (
    <Inner>
      <section className='h-[90vh] p-[4%] my-[1em] flex overflow-hidden' >
        <motion.div className='flex flex-col items-center justify-center text-center h-full w-full'
          variants={fadeIn('up', 0.2)}
          initial='hidden'
          whileInView={'show'}
          viewport={{once: true, amount: 0.7}}
        >
          <AiOutlineFileSearch  className='text-red-600 text-[100px] ErroIcon'/>
          <h1 className='text-[#757272] text-2xl  my-2.5 ErroH1'>
            Page doesn't exist
          </h1>
          <button className='transition-transform duration-300 hover:border w-fit h-fit px-4 py-1 my-2.5 text-white  bg-high rounded-[10px] cursor-pointer  btn1' onClick={handleHome}>
            Return Home
          </button>
        </motion.div>
      </section>
    </Inner>
  )
}

export default NotFound