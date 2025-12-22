import React from 'react';
import './footer.css';
import { Link } from 'react-router-dom';
import { TfiEmail } from "react-icons/tfi";
import { FaFacebook, FaInstagramSquare, FaLinkedin, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Kenyan } from '../../assets';

function footer() {

  const currentYear = new Date().getFullYear();

  const customerService=[
    { name: 'FAQ', link: '/' },
    { name: 'My Orders', link: '/' },
    { name: 'Start a Return', link: '/' },
    { name: 'Shipping and Return', link: '/' },
    { name: 'Terms and Conditions', link: '/' },
    { name: 'Privacy Policy', link: '/' },
  ];

  const Products= [
    { name: 'Shoes', link: '/' },
    { name: 'Clothing', link: '/' },
    { name: 'Accessories', link: '/' },
    { name: 'Jewellery', link: '/' },
    { name: 'Men', link: '/' },
    { name: 'Women', link: '/' },
  ];

  const CompanyInfo= [
    { name: 'About Us', link: '/' },
    { name: 'How it works', link: '/' },
    { name: 'Refer and Earn', link: '/' },
    { name: 'Our Values', link: '/' },
    { name: 'Service Discount', link: '/' },
    { name: 'Educational Discount', link: '/' },
  ];

  const FollowUs=[
    { name: 'Facebook', icon:FaFacebook, link: '/' },
    { name: 'Instagram', icon:FaInstagramSquare, link: 'https://www.instagram.com/selloryecommerce/' },
    { name: 'LinkedIn', icon:FaLinkedin, link: 'https://www.linkedin.com/in/sellory-ecommerce-5972aa39b' },
    { name: 'TikTok', icon:FaTiktok, link: 'https://www.tiktok.com/@selloryecommerce' },
    { name: 'X', icon:FaXTwitter, link: 'https://x.com/Selloryke' },
  ]

  return (
    <div className='min-h-[40vh] px-[4%] flex flex-col gap-1 overflow-hidden py-5 bg-dark text-[#cecdcd] FooterCon' id='Contact'>
      <div className='grid grid-cols-5 gap-3 justify-center items-start FooterCards'>
        <div className='flex flex-col gap-2 space-y-3'>
          <h1 className='text-2xl font-goodly text-light'>
            Sellory
          </h1>
          <p className='w-full text-sm'>
            We do not divide our collections to seasons
          </p>
          <ul className='list-none'>
            <li className='text-sm'>UpperHill, Nairobi</li>
            <li className='text-sm'>2213-00100</li>
          </ul>
          <p className='flex items-center gap-1 text-sm'><TfiEmail className='' />sales@sellory.com</p>
        </div>
        <div className='flex flex-col gap-2 space-y-3 py-2'>
          <h1 className='text-base font-sans text-light'>
            Customer Service
          </h1>
          <div className='flex flex-col justify-center gap-2 px-2'>
            {customerService.map((item, index) => {
              return (
                <Link
                  to={item?.link}
                  key={index}
                  className='text-sm hover:underline'
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
        <div className='flex flex-col gap-2 space-y-3 py-2'>
          <h1 className='text-base font-sans text-light'>
            Products
          </h1>
          <div className='flex flex-col justify-center gap-2 px-2'>
            {Products.map((item, index) => {
              return (
                <Link
                  to={item?.link}
                  key={index}
                  className='text-sm hover:underline'
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
        <div className='flex flex-col gap-2 space-y-3 py-2'>
          <h1 className='text-base font-sans text-light'>
            Company Info
          </h1>
          <div className='flex flex-col justify-center gap-2 px-2'>
            {CompanyInfo.map((item, index) => {
              return (
                <Link
                  to={item?.link}
                  key={index}
                  className='text-sm hover:underline'
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
        <div className='flex flex-col gap-2 space-y-3 py-2'>
          <h1 className='text-base font-sans text-light'>
            Follow Us
          </h1>
          <div className='flex flex-col gap-2 justify-center px-2'>
            {FollowUs.map((item, index) => {
              return (
                <Link
                  key={index}
                  to={item?.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm hover:underline flex items-center gap-2'
                  >
                    <item.icon className='text-lg icons'/>
                    {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      <hr className='my-0.5 h-px font-semibold shadow-2xl mx-2 bg-[#cecdcd]'/>
      <div className='flex items-center justify-between text-[#cecdcd] text-sm px-3 CopyCard'>
        <p className='cursor-pointer hover:underline'>
        &copy; Copyright {currentYear} all rights reserved
        </p>
        <p className='flex items-center gap-2'>
          <span className='cursor-pointer hover:underline'>Privacy</span>
          <span className='cursor-pointer hover:underline'>Security</span> 
          <span className='cursor-pointer hover:underline'>Terms</span>
        </p>
        <div className='flex items-center gap-2 Ken'>
          <img 
            src={Kenyan}
            loading='lazy'
            alt='Kenyan flag'
            className='rounded-full w-7 h-7 object-cover'
          />
          <p className='cursor-pointer hover:underline'>
            Kenyan made
          </p>
        </div>

      </div>
    </div>
  )
}

export default footer