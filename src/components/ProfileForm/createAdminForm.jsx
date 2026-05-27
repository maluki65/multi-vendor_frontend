import React, { useState, useEffect, useRef } from 'react';
import './profile.css';
import UploadProfileImg from '../../utils/ProfileImgUpload';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { useProfile } from '../../Hooks/useProfile';
import { toast, Toaster } from 'react-hot-toast';
import { FaCamera } from 'react-icons/fa';
import  { AdLoader } from '..';

const InitialFormState = {
  addresses: {
    city : '',
    postal: '',
    street: '',
    country: '',
  },

  nextOfKin: {
    relationship: '',
    names: '',
    phone: '',
  },

  gender: '',
  phoneNo: '',
  fullNames: '',
  IDPassport: '',  
}

function CreateAdminForm() {
  const { data:me, isLoading: meLoading } = useCurrentUser();
  const role = me?.role;
  const { profile, createProfile } = useProfile(role);

  if (meLoading) return null;

  const [avatar, setAvatar] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState(InitialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [ImgErr, setImgErr] = useState('');
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
      setImgErr(`Avatar image exceeds ${MAX_IMG_SIZE}MB limit`);
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
    setForm(InitialFormState);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!avatar) {
        setImgErr('Profile image is required');
        toast.error('Profile image is required');
        return;
      } 

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

      console.log('Admin profile payload:', payload);

      await createProfile(payload);
      setAvatar(null);
      setForm(InitialFormState);
      setSuccess('Profile Saved');
      setPreview(null);
      toast.success('Admin profile saved');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Failed to create profile:', error);
      setError(error.message || 'Failed to create profile');
      toast.error(error.response?.data?.data?.message || 'Error creating admin profile');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Toaster position='top-right' reverseOrder={false}/>
      {isLoading ? (
        <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
          <AdLoader/>
        </div>
      ) : (
        <div className='rounded-xl bg-white mt-3 w-full p-4 overflow-y-auto'>
          <h1 className='font-medium text-xl text-dark'>
            Add Profile
          </h1>

          <form className='flex flex-col my-2 w-full' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-3 my-1'>
              <p className='text-base leading-relaxed my-1 markedT'>{`Maximum single image file size is ${MAX_IMG_SIZE}MB`}
               {ImgErr && <p className='text-red-600'>{ImgErr}</p>}
              </p>
              <p className='flex items-center gap-2 text-[13px] markedT'>All fields marked with <span className='text-red-600'>*</span> are required!</p>
            </div>

            <div className='flex gap-2 VenImgCon'>
              <div 
                 onClick={() => avatarRef.current?.click()}
                 onDrop={handleAvatarDrop}
                 onDragOver={handleDragOverAvatar}
                 onDragLeave={handleDragLeaveAvatar}
                 className={`relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-full cursor-pointer transition  VendImg ${isDragging ? 'border-dark bg-[#405889]' : 'border-red-200'}`}
                 >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt='avatar preview'
                        className='w-full h-full object-cover shadow-md rounded-full'
                        loading='lazy'
                      />
                      <button 
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDiscard();
                        }}
                        className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full p-1 flex items-center justify-center cursor-pointer'
                        >
                          X
                        </button>
                    </>
                  ) : (
                    <div className='flex flex-col items-center justify-center w-full h-full cursor-pointer'>
                      <FaCamera className='text-gray-400 VenIcon' size={20} />
                      <p className='text-xs text-gray-500 mt-1 flex items-center'>
                        Profile Img <span className='text-red-600'>*</span>
                      </p>
                      {ImgErr && <p className='text-red-500 text-xs mt-1'>{ImgErr}</p>}
                    </div>
                  )}

                  <input
                    type='file'
                    accept='image/*'
                    ref={avatarRef}
                    onChange={handleAvatarChange}
                    className='hidden'
                  />
                </div>
            </div>

            <div className='grid grid-cols-3 gap-2 my-3 space-y-2 VenRegCon'>
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
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Fullname <span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='fullNames'
                  placeholder='John Kamau'
                  required
                  value={form.fullNames}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>ID/Passport no<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='IDPassport'
                  placeholder='9879...'
                  required
                  value={form.IDPassport}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Phone no<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='phoneNo'
                  placeholder='0793...'
                  required
                  value={form.phoneNo}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Country<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='addresses.country'
                  placeholder='Kenya'
                  required
                  value={form.addresses.country}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>City<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='addresses.city'
                  placeholder='Nairobi'
                  required
                  value={form.addresses.city}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Street<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='addresses.street'
                  placeholder='Raila Odinga Way'
                  required
                  value={form.addresses.street}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Postal code<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='addresses.postal'
                  placeholder='00100'
                  required
                  value={form.addresses.postal}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Next of kin (name)<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='nextOfKin.names'
                  placeholder='Peter Kamau'
                  required
                  value={form.nextOfKin.names}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Next of kin (relationship)<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='nextOfKin.relationship'
                  placeholder='Father'
                  required
                  value={form.nextOfKin.relationship}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Next of kin (phone no)<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='nextOfKin.phone'
                  placeholder='0796...'
                  required
                  value={form.nextOfKin.phone}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
            </div>
            <button
              type='submit'
              className='px-3 py-2 rounded-md text-white bg-primary my-4 cursor-pointer'>
                Create profile
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default CreateAdminForm