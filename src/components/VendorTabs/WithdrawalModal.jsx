import React, { useState } from 'react';
import { RiCloseCircleLine } from "react-icons/ri";

const withdrawalForm = {
  amount: '',
  accountName: '',
  tillNumber: '',
}

function WithdrawalModal({ isOpen, onClose, submit, isSubmitting, availableBalance }) {
  const [form, setForm] = useState(withdrawalForm);
  const [error, setError] = useState('');
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      if (form.amount < 1000) {
        setError('Minimum withdrawal amount is  ksh 1,000');

        setTimeout(() =>{
          setError('');
        }, 5000);

        return;
      }

      const amontInCents = Number(form.amount) * 100;

      if (amontInCents > availableBalance) {
        setError('Insufficient available balance');
        return;
      }

      const payload = {
        ...form,
        amount: amontInCents,
      }

      await submit(payload)
      setForm(withdrawalForm)
      onClose();
    } catch (error) {
      console.error('Failed to request withdrawal', error)      
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto backdrop-blur-sm'>
      <div className='bg-white rounded-2xl w-full max-w-md p-6 shadow-xl m-2 withdrawalModal'>
        <div className='flex flex-col  justify-between mb-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold withdrawalHeading'>
              Request withdrawal
            </h2>

            <button 
              onClick={onClose}
              >
                <RiCloseCircleLine className='text-red-600 cursor-pointer withdrawalIcon' size={24} />
            </button>
          </div>

          {error &&(
            <div className='text-red-600 bg-red-100 border-red-400 p-2 rounded mt-3 mb-0'>
              {error}
            </div>
          )}

          <form className='flex flex-col space-y-4 mt-5' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-1'>
              <label className='flex items-center text-sm gap-1'>Amount <span className='text-red-600'>*</span></label>
              <input 
                type='number'
                name='amount'
                placeholder='min amount is 1000'
                value={form.amount}
                onChange={handleChange}
                required
                className='p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
              />
            </div>
            <div className='grid grid-cols-2 gap-2 withdrawalModalGrid01'>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center text-sm gap-1'>Till number <span className='text-red-600'>*</span></label>
                <input 
                  type='number'
                  name='tillNumber'
                  placeholder='238468'
                  value={form.tillNumber}
                  onChange={handleChange}
                  required
                  className='p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center text-sm gap-1'>Account name<span className='text-red-600'>*</span></label>
                <input 
                  type='text'
                  name='accountName'
                  placeholder='John Doe'
                  value={form.accountName}
                  onChange={handleChange}
                  required
                  className='p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
                />
              </div>
            </div>

            <div className='flex justify-end gap-3'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 border text-dark rounded-lg cursor-pointer'
                >
                  Close
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='px-4 py-2 bg-primary text-white rounded-lg cursor-pointer'
                >
                  {isSubmitting ? 'Submitting...' : 'Submit request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WithdrawalModal