import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import UploadProfileImg from '../../../utils/ProfileImgUpload';
import { AdLoader } from '../../';

function ProfileEdit({  profile, user, onUpdate, setActiveTab }) {

  const [username, setUsername] = useState(user?.username || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [addressLabel, setAddressLabel] = useState(profile?.addresses?.[0]?.label || '');
  const [country, setCountry] = useState(profile?.addresses?.[0]?.country || '');
  const [street, setStreet] = useState(profile?.addresses?.[0]?.street || '');
  const [postalCode, setPostalCode] = useState(profile?.addresses?.[0]?.postalCode || '');
  const [city, setCity] = useState(profile?.addresses?.[0]?.city || '');
  const [fullname, setFullname]= useState(profile?.fullname || '');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(avatarFile);
    }
  }, [avatarFile]);

  useEffect(() => {
    if (profile) {
      setAddressLabel(profile?.addresses?.[0]?.label || '');
      setCountry(profile?.addresses?.[0]?.country || '');
      setCity(profile?.addresses?.[0]?.city || '');
      setStreet(profile?.addresses?.[0]?.street || '');
      setPostalCode(profile?.addresses?.[0]?.postalCode || '');
      setPhone(profile?.phone || '');
      setFullname(profile?.fullname || '');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let avatarData = null;

      if (avatarFile) {
        avatarData = await UploadProfileImg(avatarFile, user.role);
      }

      const payload = {
        username,
        phone,
        fullname,
        addresses: [
          {
            label: addressLabel,
            country,
            city,
            street,
            postalCode,
          }
        ],
        ...(avatarData && { avatar: avatarData }),
      };

      await onUpdate(payload);
      setActiveTab('BuyerProfile');

    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between'>
        <FaArrowLeft 
         onClick={() => setActiveTab('BuyerProfile')} 
         className='text-dark hover:text-primary cursor-pointer' 
         size={25} 
        />
        <h2 className='text-dark text-lg font-semibold my-4 setHeading'>Edit Profile</h2>
      </div>

      {isUploading ? (
        <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
          <AdLoader />
        </div>
        ) : (
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

            <div className='grid grid-cols-2 gap-3 profileEditSettings'>
              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Username</label>
                <input
                  type='text'
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Fullname</label>
                <input
                  type='text'
                  required
                  value={fullname}
                  onChange={e => setFullname(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Phone</label>
                <input
                  type='text'
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Address Label</label>
                <select
                  required
                  value={addressLabel}
                  onChange={e => setAddressLabel(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                 >
                  <option value=''>Select Address Label</option>
                  <option value='Home'>Home</option>
                  <option value='Office'>Office</option>
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Country</label>
                <input
                  type='text'
                  required
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>City</label>
                <input
                  type='text'
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Street</label>
                <input
                  type='text'
                  required
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Postal Code</label>
                <input
                  type='text'
                  required
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label>Profile Image</label>

              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt='Preview'
                  className='h-24 w-24 rounded-full object-cover'
                />
              )}

              <input
                type='file'
                accept='image/*'
                onChange={e => setAvatarFile(e.target.files[0])}
                className='text-primary cursor-pointer'
              />
            </div>

            <div className='flex gap-3 items-center'>
              <button className='bg-primary text-white px-4 py-2 font-medium rounded-lg w-fit cursor-pointer hover:bg-transparent hover:border-dark hover:border hover:text-dark'>
                {isUploading ? 'Updating...' : 'Update Profile'}
              </button>

              <button 
               type='button' 
               onClick={() => setActiveTab('BuyerProfile')}
               className='border border-dark bg-transparent rounded-lg w-fit px-4  cursor-pointer py-2 hover:border-none hover:bg-orange-400'
                >
                Cancel
              </button>
            </div>

          </form>
        )
      }
    </div>
  )
}

export default ProfileEdit