import React, { useState } from 'react';
import "./Tabs.css";
import { Loader } from '..';
import { useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { RiAdminLine } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const InitialFormState = {
  username: '',
  email: '',
  password: '',
}

function AddAdmin() {
  const [showPassword, setShowPassWord] = useState(false);
  const [form, setForm] = useState(InitialFormState);
  const [isloading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true)

    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: 'Admin'
    }

    try{
      await Api.post('/admin/create', payload);
      setForm(InitialFormState);
      queryClient.invalidateQueries(['users']);
      setSuccess('Admin created successfully');
      setTimeout(() => {
        setSuccess('');
      }, 5000);

    } catch(error){
      console.error('Failed to create Admin:', error);
      setError(error.response?.data?.message || 'Something went wrong while adding user');
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='m-4 max-w-7xl mx-auto flex-1 flex justify-center items-center addForm'> 
      {isloading ? (
        <Loader/>
      ): (
        <form className='p-4 rounded-xl shadow-md flex flex-col space-y-2 bg-white' onSubmit={handleSubmit}>
          {error && (
            <div className='text-red-600 bg-red-100 border-red-400 p-2 rounded mb-3'>
              {error}
            </div>
          )}
          {success && (
            <div className='text-green-600 bg-green-100 border-green-400 p-2 rounded mb-3'>
              {success}
            </div>
          )}
          <h1 className='text-xl font-semibold adminH1'> Add Admin</h1>
          <p className='text-md text-gray-600 adminP'>
            All fields marked with <span className='text-red-600'>(*)</span> are required. Make sure email and username are unique
          </p>
          <div className='flex flex-col gap-2 space-y-2'>
            <div className='flex flex-col gap-2'>
              <label className='flex items-center gap-2 font-medium text-dar'>Email: <span className='text-md text-red-600'>*</span></label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="johndoe@gmail.com"
                className="p-2 outline-none rounded bg-gray-200 focus:bg-gray-100 focus:border-2 focus:border-gray-400"
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 space-y-2'>
            <div className='flex flex-col gap-2'>
              <label className='font-medium text-dark flex items-center gap-2'>UserName: <span className='text-md text-red-600'>*</span></label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Jane Doe"
                className="p-2 outline-none rounded bg-gray-200 focus:bg-gray-100 focus:border-2 focus:border-gray-400"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 relative">
            <label className="font-medium text-gray-700">Password: <span className="text-red-500">*</span></label>
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
                className='w-full p-2 outline-none rounded bg-gray-200 focus:bg-gray-100 focus:border-2 focus:border-gray-400'
              />
              <span 
                onClick={() => setShowPassWord(prev => !prev)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
              >
                {showPassword ? <AiFillEyeInvisible className='Icon' size={20}/> : <AiFillEye className='Icon' size={20}/>}
              </span>
            </div>
          </div>
          <div className="mt-6 text-right">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isloading}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-gray-800 cursor-pointer"
            >
              {isloading ? 'Submitting...' : 'Add Admin'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddAdmin