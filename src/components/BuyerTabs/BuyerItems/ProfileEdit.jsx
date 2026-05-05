import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import UploadProfileImg from '../../../utils/ProfileImgUpload';
import { AdLoader } from '../../';

function ProfileEdit({  profile, user, onUpdate, activeTab, setActiveTab }) {

  const [username, setUsername] = useState(user?.username || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(avatarFile);
    }
  }, [avatarFile]);

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
    <div className='p-2 flex flex-col space-y-4'>
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

            <div className='flex flex-col gap-1'>
              <label>Username</label>
              <input
                type='text'
                value={username}
                onChange={e => setUsername(e.target.value)}
                className='input'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label>Phone</label>
              <input
                type='text'
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className='input'
              />
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
              />
            </div>

            <button className='btn-primary'>
              {isUploading ? 'Updating...' : 'Update Profile'}
            </button>

            <button type='button' onClick={() => setActiveTab('BuyerProfile')}>
              Cancel
            </button>

          </form>
        )
      }
    </div>
  )
}

export default ProfileEdit