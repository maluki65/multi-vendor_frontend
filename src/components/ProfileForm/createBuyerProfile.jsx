import React, { useState, useEffect, useRef } from 'react';
import './profile.css';
import { toast, Toaster } from 'react-hot-toast';
import { useProfile } from '../../Hooks/useProfile';
import UploadProfileImg from '../../utils/ProfileImgUpload';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { WLoader } from '..';
import { FaCamera } from "react-icons/fa";

const IntialFormState = {
  fullname: '',
  phone: '',
  gender:'',
  addresses: [
    {
      label: '',
      country: '',
      city: '',
      street: '',
      postalCode: '',
    }
  ],
  preferences: {
    currency: '',
    //language: '',
    notification: {
      email: false,
      sms: false,
      push: false,
    }
  },
  /*avatar: '',
  avatarId: '',*/
}
function CreateBuyerProfile() {
  const { data:me, isLoading: meLoading } = useCurrentUser();
  const role = me?.role;
  const { profile, createProfile } = useProfile(role);

  if (meLoading) return null;

  const [avatar, setAvatar] = useState(null);
  const [isDraging, setIsDragging] = useState(false);
  const [form, setForm] = useState(IntialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [ImgErr, setImgErr] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const avatarRef = useRef();

  const MAX_IMG_SIZE = 5;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file && file.size > MAX_IMG_SIZE * 1024 * 1024){
      setImgErr('Avatar image exceeds 5MB limit');
      return;
    }
    setAvatar(file);
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const newPreview = URL.createObjectURL(file);
    setPreview(newPreview);
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');

    setForm(prev => {
      const updated = structuredClone(prev);
      let current = updated;

      for (let i = 0; i < keys.length -1; i++) {
        current = current[keys[i]];
      }

      current[keys.at(-1)] = type === 'checkbox' ? checked : value;

      return updated;
    });
  };

  const handleDragOverAvatar = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleAvatarDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if(file && file.type.startsWith('image/')){
      handleAvatarChange({
        target: {
          files: [file]
        }
      });
    }
  };

  const handleDragLeaveAvatar = () => {
    setIsDragging(false);
  }

  const handleDiscard = () => {
    setPreview(null);
    setAvatar(null);
    setForm(IntialFormState);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try{
     let avatarData = {};

     if (avatar) {
      const { url, fileId } = await UploadProfileImg(avatar, role);
      avatarData = {
        avatar: url,
        avatarId: fileId
      };
     }

      const payload = {
        ...form,
        ...avatarData
      };

      //console.log(payload);

      await createProfile(payload);
      setAvatar(null);
      setForm(IntialFormState);
      setSuccess('Profile Saved');
      setPreview(null);
      toast.success('Profile Saved');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error(error);
      setError(error.message || 'Failed to create profile.');
      toast.error(error.response?.data?.message || 'Error creating profile');      
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  }

  /*const handleUpload = async (file) => {
    const image = await UploadProfileImg(file, me.role);
  }*/
  return (
    <div>
     <Toaster position='top-right' reverseOrder={false}/>
     {isLoading ? (
      <WLoader/>
     ): (
      <div className='rounded-xl bg-white mt-3 w-full p-4 overflow-y-auto'>
        <h1 className='font-medium text-xl text-dark'>
          Add Profile
        </h1>
        <form className='flex flex-col my-2 w-full' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-3 my-1'>
            <p className='text-xs leading-relaxed my-1'>
            {`Maximum single image file size is ${MAX_IMG_SIZE}MB`}
              {ImgErr && <p className='text-red-600'>{ImgErr}</p>}
            </p>
          </div>

          <div className='flex gap-2'>
            <div 
              onDrop={handleAvatarDrop}
              onDragOver={handleDragOverAvatar}
              onDragLeave={handleDragLeaveAvatar}
              className={` relative flex flex-col items-center justify-center w-23 h-23 border-2 border-dashed rounded-full cursor-pointer transition ${isDraging ? 'border-dark bg-[#405889]' : 'border-red-200'}`}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt='avatar preview'
                      className='w-full h-full object-cover rounded-full shadow-md'
                      onClick={() => avatarRef.current.click()}
                    />
                    <button 
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDiscard();
                      }}
                      className='absolute -top-1 -right-1 bg-red-600 p-2 text-white w-h h-5 text-xs rounded-full cursor-pointer flex items-center justify-center'
                      >
                        x
                      </button>
                  </>
                ) : (
                  <label
                  htmlFor='avatar'
                  className='flex flex-col items-center justify-center w-full h-full cursor-pointer'
                  >
                    <FaCamera className='text-muted' size={20}/>
                  </label>
                )}
                
                <input
                  id='avatar'
                  type='file'
                  accept='image/*'
                  ref={avatarRef}
                  onChange={handleAvatarChange}
                  className='hidden'
                />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2 my-3 names'>
            <div className='flex flex-col gap-1'>
              <label className=' flex text-dark text-sm items-center gap-2'>
                Fullname: <span className='text-red-600'>*</span>
              </label>
              <input
                type='text'
                name='fullname'
                placeholder='John Doe'
                value={form.fullname}
                onChange={handleChange}
                required
                className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7] w-full'
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className=' flex text-dark text-sm items-center gap-2'>
                Phone: <span className='text-red-600'>*</span>
              </label>
              <input
                type='number'
                name='phone'
                placeholder='079765...'
                value={form.phone}
                onChange={handleChange}
                required
                className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7] w-full'
              />
            </div>
          </div>

          <div className='flex flex-col gap-4 my-4 items-start'>
            <label className='flex items-center space-x-1 text-md'>
              <input
                type='radio'
                name='gender'
                value='Male'
                checked={form.gender === 'Male'}
                onChange={handleChange}
                className='accent-primary cursor-pointer'
              />
              <span className='text-sm text-[#403f3f]'>Male</span>
            </label>
            <label className='flex items-center space-x-1 text-md'>
              <input
                type='radio'
                name='gender'
                value='Female'
                checked={form.gender === 'Female'}
                onChange={handleChange}
                className='accent-primary cursor-pointer'
              />
              <span className='text-sm text-[#403f3f]'>Female</span>
            </label>
            <label className='flex items-center space-x-1 text-md'>
              <input
                type='radio'
                name='gender'
                value='Other'
                checked={form.gender === 'Other'}
                onChange={handleChange}
                className='accent-primary cursor-pointer'
              />
              <span className='text-sm text-[#403f3f]'>Other</span>
            </label>
          </div>

          <div className='grid grid-cols-3 gap-2 space-y-2 addresses'>
            <div className='flex flex-col gap-1'>
              <label className='flex items-center gap-1'>Address label <span className='text-red-600'>*</span></label>
              <input 
                type='text'
                required
                name='addresses.0.label'
                placeholder='Address label (Home, Office)'
                value={form.addresses[0].label}
                onChange={handleChange}
                className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7] w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='flex items-center gap-1'>Country <span className='text-red-600'>*</span></label>
              <input 
                type='text'
                required
                name='addresses.0.country'
                placeholder='Country'
                value={form.addresses[0].country}
                onChange={handleChange}
                className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7] w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='flex items-center gap-1'>City<span className='text-red-600'>*</span></label>
              <input 
                type='text'
                required
                name='addresses.0.city'
                placeholder='City'
                value={form.addresses[0].city}
                onChange={handleChange}
                className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7] w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='flex items-center gap-1'>Street<span className='text-red-600'>*</span></label>
              <input 
                type='text'
                required
                name='addresses.0.street'
                placeholder='Street'
                value={form.addresses[0].street}
                onChange={handleChange}
                className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7] w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='flex items-center gap-1'>Postal Code<span className='text-red-600'>*</span></label>
              <input 
                type='text'
                required
                name='addresses.0.postalCode'
                placeholder='00100'
                value={form.addresses[0].postalCode}
                onChange={handleChange}
                className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7] w-full'
              />
            </div>

            {/*<label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="addresses.0.isDefault"
                checked={form.addresses[0].isDefault || false}
                onChange={handleChange}
              />
              Default address
            </label>*/}
          </div>

          <div className='flex flex-col gap-1'>
            <label className='flex items-center gap-1'>currency <span className='text-red-600'>*</span></label>
            <select
              name='preferences.currency'
              value={form.preferences.currency}
              onChange={handleChange}
              required
              className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7] w-full'
            >
              <option value=''>Preferred currency</option>
              <option value='KES'>KES</option>
              {/*<option value='USD'>USD</option>
              <option value='EUR'>EUR</option>
              <option value='USDT'>USDT</option>*/}
            </select>
          </div>

          <div className='grid grid-cols-3 gap-2 mt-4 notification'>
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="preferences.notification.email"
                checked={form.preferences.notification.email}
                onChange={handleChange}
              />
              Email notifications
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="preferences.notification.sms"
                checked={form.preferences.notification.sms}
                onChange={handleChange}
              />
              SMS notifications
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="preferences.notification.push"
                checked={form.preferences.notification.push}
                onChange={handleChange}
              />
              Push notifications
            </label>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='text-white  bg-primary rounded-xl py-1 cursor-pointer my-4'
          >
            Save Changes
          </button>
        </form>
      </div>
     )}
    </div>
  )
}

export default CreateBuyerProfile