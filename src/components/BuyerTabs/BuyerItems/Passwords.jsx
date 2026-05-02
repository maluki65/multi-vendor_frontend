import React, { useState, useEffect } from 'react';
import '../BuyerTabs.css';
import { useProfile } from '../../../Hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { MdLockOutline } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const InitialPasswordForm = {
  currentPassword: '', 
  newPassword: '',
  confirmPassword: '',
}

function Passwords() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(InitialPasswordForm);
  const [showError, setShowError] = useState(true);
  const [error, setError] = useState('');

  const { updatePassword } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev, [name] : value
    }));
  } 

  const handleUpdatePassword = async(e) => {
    e.preventDefault();
      setError('');

    if (form.newPassword !== form.confirmPassword){
      setError("New password and confirm password don't match");
      return;
    }

    try{
      const payload = {
        newPassword: form.newPassword,
        currentPassword: form.currentPassword,
      };

      updatePassword.mutate(payload, {
        onSuccess: (data) => {
          setForm(InitialPasswordForm);

          if (data?.forceLogout) {
            navigate('/signin');
          }
        }
      });
    } catch(error) {
      console.error('Failed to update password:', error);
      setError(error?.message || 'Something went wrong');
    }
  }

  return (
    <section className='bg-gray-100 shadow-md rounded-lg p-2 w-[60%] AccPassContainer'>
      <div className='flex flex-col space-y-2'>
        <div className='flex items-center gap-3 p-2'>
          <span className='border-[1.4px] border-gray-400 p-2 rounded-full'>
            <MdLockOutline  className='text-gray-500' size={25} />
          </span>
          <div className='flex flex-col gap-1'>
            <h3 className='font-semibold text-gray-600 text-xl'>
              Change Password
            </h3>
            <p className='text-gray-500 text-base leading-relaxed'>
              Update password for enhanced account security.
            </p>
          </div>
        </div>
        <hr className='flex-1 border-t-[1.3px] border-gray-400' />
      </div>

      <form onSubmit={handleUpdatePassword} className='flex flex-col space-y-1 my-2 p-2'>
        {error &&(
          <div className='text-red-600 bg-red-100 border-red-400 p-2 rounded mb-3'>
            {error}
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <label className='text-dark font-semibold'>Current Password *</label>
          <div className='relative mb-1 flex items-center'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='currentPassword'
              value={form.currentPassword}
              onChange={handleChange}
              placeholder='current password...'
              required
              className='w-full p-2 mb-2 border-[1.5px] border-gray-300 rounded-xl outline-none focus:border-orange-400'
            />
            <span
              onClick={() => setShowPassword(prev => !prev)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 '
              >
                {showPassword ? <AiFillEyeInvisible className='' size={20} /> : <AiFillEye className='' size={20} />}
              </span>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-dark font-semibold'>New Password *</label>
          <div className='relative mb-1 flex items-center'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='newPassword'
              value={form.newPassword}
              onChange={handleChange}
              placeholder='new password...'
              required
              className='w-full p-2 mb-2 border-[1.5px] border-gray-300 rounded-xl outline-none focus:border-orange-400'
            />
            <span
              onClick={() => setShowPassword(prev => !prev)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 '
              >
                {showPassword ? <AiFillEyeInvisible className='' size={20} /> : <AiFillEye className='' size={20} />}
              </span>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-dark font-semibold'>Confirm New Password *</label>
          <div className='relative mb-1 flex items-center'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='confirmPassword'
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder='confirm new password...'
              required
              className='w-full p-2 mb-2 border-[1.5px] border-gray-300 rounded-xl outline-none focus:border-orange-400'
            />
            <span
              onClick={() => setShowPassword(prev => !prev)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 '
              >
                {showPassword ? <AiFillEyeInvisible className='' size={20} /> : <AiFillEye className='' size={20} />}
              </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2 items-center w-full my-2 AccPassBtn'>
          <button
            type='button'
            onClick={() => setForm(InitialPasswordForm)}
            className='rounded-xl border-[1.4px] border-gray-300 px-4 py-2 text-gray-600 cursor-pointer AccBtn756'>
              Discard
          </button>
          <button
            type='submit'
            className='rounded-xl bg-primary text-white px-4 py-2 cursor-pointer AccBtn756'>
              Apply Changes
          </button>
        </div>
      </form>
    </section>
  )
}

export default Passwords