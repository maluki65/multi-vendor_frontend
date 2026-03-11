import React, { useState } from 'react';
import './Tabs.css';
import { ProductApproval, Category } from '..';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { FaOpencart } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";

function ProductCategoryTabs({ prodCategories, setProductCategories}){
  const prodCategory = [
    { name: 'Product verification', icon: FaOpencart },
    { name: 'Product categories', icon: MdOutlineCategory }
  ]

  return (
    <div className='flex flex-wrap gap-2 items-center relative'>
      {prodCategory?.map((item, index) => (
        <button
          key={index}
          type='button'
          onClick={() => {
            setProductCategories(item.name)
          }}
          className={`group flex items-center text-sm gap-3 font-medium p-2 ${prodCategories === item.name
            ? 'bg-primary rounded-full'
            : ''}`}>
              <div className='text-dark'>
                {React.createElement(item?.icon, { size: '25' })}
              </div>
              <h2
                style={{
                  transitionDelay: `${index + 2 }00ms`
                }}
                className='whitespace-pre  font-medium cursor-pointer'>
                  {item?.name}
                </h2>
        </button>
      ))}
    </div>
  )
}

function ProductCategory({ role, userId }) {
  const [prodCategories, setProductCategories] = useState('Product verification');
  
  return (
    <section className='my-2 p-4 flex flex-col gap-3 bg-white rounded-xl'>
      <Toaster position='top-right' reverseOrder = {false} />
      <ProductCategoryTabs
        prodCategories={prodCategories}
        setProductCategories={setProductCategories}
      />
      <div className='bg-white px-4 rounded-xl h-full'>
        <AnimatePresence mode='wait'>
          {prodCategories === 'Product verification' && (
            <motion.div
              key='Product verification'
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.95}}
              transition={{duration: 0.3}}
              >
                <ProductApproval />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode='wait'>
          {prodCategories === 'Product categories' && (
            <motion.div
              key='Product categories'
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.95}}
              transition={{duration: 0.3}}
              >
                <Category />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default ProductCategory