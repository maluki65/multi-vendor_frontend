import React, { useState } from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import { cartB1, cartB2, cartB3, cartB4, cartB5, cartB6, cartB7, cartB8, cartB10 } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../..';
import { FaFacebook, FaPinterest, FaInstagramSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { AiFillTikTok } from "react-icons/ai";

const InitialContactForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

function Contact() {
  const [form, setForm] = useState(InitialContactForm);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev, [name]: value
    }));
  }

  const ContactIcons = [
    { name: 'FaceBook', link: '', icon: FaFacebook },
    { name: 'X', link: '', icon: FaXTwitter },
    { name: 'Pinterest', link: '', icon: FaPinterest },
    { name: 'Instagram', link: '', icon: FaInstagramSquare },
    { name: 'Tiktok', link: '', icon: AiFillTikTok },

  ]

  return (
    <Inner>
      <section className='min-h-[30vh] flex flex-col justify-center items-center overflow-hidden'
        style={{
          backgroundImage: `url(${cartB10})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <h1 className='font-semibold text-4xl text-dark leading-relaxed PathName'>
            Contact Us
          </h1>
          <span className='flex items-center gap-1'>
            <a
              onClick={() => navigate('/buyer/products')}
              className='text-gray-700 hover:text-primary cursor-pointer path'>
                Home
              </a>
              <a 
                className='text-gray-700 path'>
                / Contact Us
              </a>
          </span>
      </section>
      
      <section className='min-h-[40vh] px-[2%] my-6'>
        <div className='grid grid-cols-2 gap-3 contactForms3'>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col my-3'>
              <h2 className='font-semibold leading-relaxed text-xl text-dark'>
                Get in Touch
              </h2>
              <p className='text-base text-gray-700 leading-relaxed'>
                Your email will not be shared. All fields marked with * are required
              </p>
            </div>
            <form className='flex flex-col gap-2 space-y-2'>
              <div className='grid grid-cols-2 gap-3 w-full contactNEm'>
                <div className='flex flex-col gap-1'>
                  <label className='font-semibold text-sm'>Your Name *</label>
                  <input
                    type='text'
                    required
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    placeholder='John Doe'
                    className='rounded-full border-[1.3px] border-gray-400  text-gray-700 p-2 focus:outline-none focus:border-orange-400 focus:bg-gray-100'
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label className='font-semibold text-sm'>Email *</label>
                  <input
                    type='text'
                    required
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder='johndoe@gmail.com'
                    className='rounded-full border-[1.3px] border-gray-400 p-2 focus:outline-none focus:border-orange-400 focus:bg-gray-100'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-1'>
                <label className='font-semibold text-sm'>Subject *</label>
                <input
                  type='text'
                  required
                  name='subject'
                  value={form.subject}
                  onChange={handleChange}
                  placeholder='Enter Subject'
                  className='rounded-full border-[1.3px] border-gray-400  p-2 focus:outline-none focus:border-orange-400 focus:bg-gray-100'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='font-semibold text-sm'>Email *</label>
                <textarea
                  type='text'
                  required
                  rows={6}
                  name='message'
                  value={form.message}
                  onChange={handleChange}
                  placeholder='Enter message...'
                  className='rounded-xl border-[1.3px] border-gray-400 p-2 focus:outline-none focus:border-orange-400 focus:bg-gray-100'
                />
              </div>

              <button 
                className='text-white bg-dark rounded-full px-3 py-2 w-fit cursor-pointer'>
                  Sent Message
                </button>
            </form>
          </div>
          
          <div className='flex item-center justify-center'>
            <div className='bg-dark text-white w-[65%] rounded-xl p-4 flex flex-col justify-between contactET0988'>
              <div className='flex flex-col space-y-1'>
                <h4 className='text-lg text-white'>Address</h4>
                <p className='leading-relaxed text-muted text-sm'>
                  UpperHill, Nairobi 2213-00100
                </p>
              </div>

              <div className='flex flex-col space-y-1'>
                <h4 className='text-lg text-white'>Contact</h4>
                <div className='flex flex-col gap-2'>
                  <p className='leading-relaxed text-muted text-sm'>
                    Phone: +254 799 863 940
                  </p>
                  <p className='leading-relaxed text-muted text-sm'>
                    Email: info@sellory.com
                  </p>
                </div>
              </div>

              <div className='flex flex-col space-y-1'>
                <h4 className='text-lg text-white'>Open Time</h4>
                <div className='flex flex-col gap-2'>
                  <p className='leading-relaxed text-muted text-sm'>
                    Monday - Friday : 9:00 - 17:00
                  </p>
                  <p className='leading-relaxed text-muted text-sm'>
                    Saturday - Sunday: 9:00 - 14:00
                  </p>
                </div>
              </div>

              <div className='flex flex-col space-y-1'>
               <h4 className='text-lg text-white'>Stay Connected</h4>
               <div className='flex items-center gap-3'>
                 {ContactIcons.map((item) => {
                  const Icon = item.icon
                  return (
                    <span className='p-2 rounded-full bg-orange-400 cursor-pointer'>
                      <Icon className='text-dark RevStarComm' size={23} />
                    </span>
                  )
                 })}
               </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='h-[50vh] my-6 w-full'>
        <iframe 
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7977.584753832562!2d36.81631775!3d-1.2993677499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e7afcbe647%3A0x8c73172faa633890!2sUpper%20Hill%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1777412555821!5m2!1sen!2ske' allowFullScreen='' 
        loading='lazy' 
        referrerPolicy='no-referrer-when-downgrade' 
        className='w-full h-full border-0'
        />
      </section>

      <div className='p-2'>
        <Footer />
      </div>
    </Inner>
  )
}

export default Contact