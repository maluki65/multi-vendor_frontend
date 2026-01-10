import React, { useState } from 'react';
import './Auth.css';
import useSignUp from '../../Hooks/useSignUp'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { Loader } from '../../components'
import { FcGoogle } from "react-icons/fc";

const InitialFormState = {
  username:'',
  email: '',
  password:'',
  confirmPassword: '',
};

function BuyerSign() {
  
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { registerUser, isLoading, error, success } = useSignUp();
  const [BuyerForm, setBuyerForm] = useState(InitialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBuyerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuyerSignup = async (e) => {
    e.preventDefault();

    if (BuyerForm.password !== BuyerForm.confirmPassword) {
      setFormError('Password do not match');
      return;
    }

    setFormError('');

    const payload = {
      username: BuyerForm.username,
      password: BuyerForm.password,
      email: BuyerForm.email,
      role: 'Buyer',
    }

    //console.log('Payload', payload);

    await registerUser(payload);
  };

  const handleNavigate = () => {
    navigate('/signin');
  }

  return (
    <div className='flex flex-col justify-center items-center px-6'>
      <form onSubmit={handleBuyerSignup} className='w-full space-y-2'>
        {error && (
          <div className='text-red-600 bg-red-100 border border-red-400 p-2 rounded mb-3 errorF'>
            {error}
          </div>
        )}
        {formError && (
          <div className="text-red-600 bg-red-100 border border-red-400 p-2 rounded mb-3 errorF">
            {formError}
          </div>
        )}
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Email</label>
          <input
            name= 'email'
            type='text'
            value={BuyerForm.email}
            onChange={handleChange}
            placeholder='johndoe@gmail.com'
            required
            className='w-full p-2 mb-3 border-[1.5px] border-gary-300 rounded-md'
            rules={[
              {
                message: 'Please enter email',
              },
            ]}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Username</label>
          <input
            name= 'username'
            type='text'
            value={BuyerForm.username}
            onChange={handleChange}
            placeholder='johndoe'
            required
            className='w-full p-2 mb-3 border-[1.5px] border-gary-300 rounded-md'
            rules={[
              {
                message: 'Please enter username',
              },
            ]}
          />
        </div>
        <div className='grid grid-cols-2 gap-2 passInputs'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold'>Password</label>
            <div className='relative mb-1 flex items-center'>
              <input
                name='password'
                value={BuyerForm.password}
                onChange={handleChange}
                type={showPassword ? 'text' :'password'}
                required
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
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold'>Confirm Password</label>
            <div className='relative mb-1 flex items-center'>
              <input
                name='confirmPassword'
                value={BuyerForm.confirmPassword}
                onChange={handleChange}
                type={showConfirmPassword ? 'text' :'password'}
                required
                className='w-full p-2 mb-3 border-[1.5px] border-gray-300 rounded-md'
              />
              <span
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
                >
                  {showConfirmPassword ? <AiFillEyeInvisible size={20}/> : <AiFillEye size={20} />}
              </span>
            </div>
          </div>
        </div>
        <button
          className='relative w-full inset-0 bg-blue-500 text-white cursor-pointer rounded-xl py-3 px-2'
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader/> processing
            </span>
          ) : ('Sign Up')}
        </button>
      </form>
      <div className='flex flex-col gap-2 my-4'>
        <div className='flex items-center gap-2'>
          <hr className='flex-1 border-t border-gray-300' />
          <p className='text-sm text-gray-500 whitespace-nowrap cont'>
            or continue with
          </p>
          <hr className='flex-1 border-t border-gray-300' />
        </div>
        <div className='flex items-center justify-center gap-3'>
          <p className=' py-1 px-6 bg-gray-300 rounded'><FaFacebook className='text-blue-500 cursor-pointer icon' size={22} /></p>
          <p className=' py-1 px-6 bg-gray-300 rounded'><FcGoogle className='cursor-pointer icon' size={22} /></p>
          <p className=' py-1 px-6 bg-gray-300 rounded'><FaLinkedin className='text-blue-500 cursor-pointer icon' size={22} /></p>
        </div>
        <p className='flex items-center justify-center gap-1 my-4 text-gray-500 text-sm para'>Have an account? <span className='text-blue-600 cursor-pointer hover:underline' onClick={handleNavigate}>Sign in</span></p>
      </div>
    </div>
  )
}

export default BuyerSign