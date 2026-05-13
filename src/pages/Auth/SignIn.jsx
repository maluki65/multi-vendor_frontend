import React, { useState } from 'react';
import './Auth.css';
import { Inner } from '../../commons';
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { Loader } from '../../components'
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import useSignIn from '../../Hooks/useSignIn';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SignIn01, SignIn02 } from '../../assets';

const InitialFormState = {
  email: '',
  password: '',
}

function SignIn() {
  const navigate = useNavigate();
  const { SignInUser, error, isLoading} = useSignIn();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(InitialFormState);

  const handleChange = (e) => {
    const { name, value } =  e.target;

    setForm ((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    const { email, password } = form;
  
    try {
      const res = await SignInUser({ email, password });
  
      const role = res?.user?.role;
  
      if (role === 'Buyer') {
        navigate('/buyer');
      } else {
        navigate('/dashboard');
      }
  
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigate = () => {
    navigate('/register');
  };

  return (
    <Inner>
      <section className='min-h-screen overflow-hidden flex p-2' style={{
        backgroundImage: `url(${SignIn02})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className='w-full grid grid-cols-2 gap-4 signCon'>
          <div className='signImg'></div>
          <div className='flex flex-col gap-2 space-y-3  w-full bg-white p-3 rounded-2xl justify-center'>
           <h1 className='text-[#1b1a1a] text-4xl font-semibold create'>
            Welcome back!
           </h1>
           <p className='text-[#595757] signInText'>
            Sign in to securely access your account and manage your activities in one place.
           </p>
           <form onSubmit={handleSignIn} className=' w-full space-y-2'>
             {error && (
              <div className='text-red-600 bg-red-100 border border-red-400 p-2 rounded mb-3'>
                {error}
              </div>
             )}
             <div className='flex flex-col gap-1'>
              <label className='text-sm font-semibold'>Email</label>
              <input 
                name='email'
                type='text'
                value={form.email}
                onChange={handleChange}
                placeholder='janedoe@gmail.com'
                required
                className='w-full p-2 mb-3 border-[1.5px] border-gray-300 rounded-md'
                rules={[
                  {
                    message: 'Please enter your email',
                  }
                ]}
              />
             </div>
             <div className='flex flex-col gap-1'>
              <label className='text-sm font-semibold'>Password</label>
              <div className='relative mb-1 flex items-center'>
                <input 
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='password'
                  required
                  rules={[
                   {
                    message: 'Please enter your password',
                   },
                  ]}
                  className='w-full p-2 mb-3 border-[1.5px] border-gray-300 rounded-md'
                />
                <span 
                  onClick={() => setShowPassword(prev => !prev)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
                >
                  {showPassword ? <AiFillEyeInvisible size={20}/> : <AiFillEye size={20} />}
                </span>
              </div>
             </div>
             <div className='flex items-center justify-between my-3'>
              <label className='flex items-center gap-2 text-dark cursor-pointer font-serif'>
                <input
                  type='checkbox'
                  id='rememberMe'
                  name='rememberMe'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='text-primary'
                />
                <span className='text-sm cursor-pointer rem01'>Remember me</span>
              </label>
              <a className='text-primary text-sm cursor-pointer hover:underline fonr-serif rem'>
                Forgot Password?
              </a>
             </div>
             <button
               className='relative w-full inset-0 bg-dark text-white cursor-pointer rounded-full py-3 px-2'
               type='sunmit'
               disabled={isLoading}
              >
                {isLoading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <Loader/> Processing...
                  </span>
                ) : ('Sign In')}
              </button>
           </form>
           <div className='flex flex-col gap-2 my-4'>
            <div className='flex items-center gap-2'>
              <hr className='flex-1 border-t border-gray-300'/>
              <p className='text-sm text-gary-500'>
                or continue with
              </p>
              <hr className='flex-1 border-t border-gray-300'/>
            </div>
            <div className='flex items-center justify-center gap-3'>
              <p className='py-1 px-6 bg-gray-300 rounded'>
                <FaFacebook className='text-primary cursor-pointer icon' size={22} />
              </p>
              <p className=' py-1 px-6 bg-gray-300 rounded'>
               <FcGoogle className='cursor-pointer icon' size={22} />
              </p>
              <p className=' py-1 px-6 bg-gray-300 rounded'>
               <FaLinkedin className='text-primary cursor-pointer icon' size={22} />
              </p>
            </div>
            <p className='flex items-center justify-center gap-1 my-4 text-gray-500 text-sm para'>Don't have an account? <span className='text-primary cursor-pointer hover:underline' onClick={handleNavigate}>Sign Up</span></p>
           </div>
          </div>
        </div>
      </section>
    </Inner>
  )
}

export default SignIn