import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import UploadProfileImg from '../../../utils/ProfileImgUpload';
import { AdLoader } from '../../';

function EditAdminProfile({ setActiveTab, profile, user, onUpdate }) {
  const [fullNames, setFullNames] = useState(profile?.fullNames || '');
  const [username, setUsername] = useState(user?.username || '');
  const [phoneNo, setPhoneNo] = useState(profile?.phoneNo || '');

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || '');

  const [country, setCountry] = useState(profile?.addresses?.country || '');
  const [street, setStreet] = useState(profile?.addresses?.street || '');
  const [postal, setPostal] = useState(profile?.addresses?.postal || '');
  const [city, setCity] = useState(profile?.addresses?.city || '');

  const [relationship, setRelationship] = useState(profile?.nextOfKin?.relationship || '');    
  const [names, setNames] = useState(profile?.nextOfKin?.names || '');    
  const [phone, setPhone] = useState(profile?.nextOfKin?.phone || '');

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
        setCountry(profile?.addresses?.country || '');
        setCity(profile?.addresses?.city || '');
        setStreet(profile?.addresses?.street || '');
        setPostal(profile?.addresses?.postal || '');
        setPhoneNo(profile?.phoneNo || '');
        setFullNames(profile?.fullNames || '');
      }
    }, [profile]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsUploading(true);

      try{
        let avatarData = null;
        if (avatarFile) {
          avatarData = await UploadProfileImg(avatarFile, user.role);
        }

        const payload = {
          fullNames,
          username,
          phoneNo,
          addresses: {
            country,
            city,
            street,
            postal,
          },
          nextOfKin: {
            names,
            phone,
            relationship,
          },

          ...(avatarData && { 
            avatar: avatarData.url,
            avatarId: avatarData.fileId,
           }),
        };

        await onUpdate(payload);
        setActiveTab('AdminProfile');
      } catch (error) {
        console.error('Failed to update profile', error);
      } finally {
        setIsUploading(false);
      }
    }

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between'>
        <FaArrowLeft
          onClick={() => setActiveTab('AdminProfile')}
          className='text-dark hover:text-primary cursor-pointer'
          size={25}
        />
        <h2 className='text-dark text-lg font-semibold my-4'>
         Edit Profile
        </h2>
      </div>

      {isUploading ? (
        <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
          <AdLoader />
        </div>
      ): (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col items-center justify-center gap-3'>
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt='avatar'
                className='w-28 h-28 rounded-full object-cover border'
              />
            )}

            <input
              type='file'
              accept='image/*'
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className='text-base cursor-pointer text-primary font-semibold'
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[
              {
                label: 'Full Names',
                value: fullNames,
                setter: setFullNames,
                type: 'text',
              },
              {
                label: 'Username',
                value: username,
                setter: setUsername,
                type: 'text',
              },
              {
                label: 'Phone Number',
                value: phoneNo,
                setter: setPhoneNo,
                type: 'text',
              },
            ].map((field, index) => (
              <div key={index} className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>
                  {field.label}
                </label>

                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                />
              </div>
            ))}

            {[
              {
                label: 'Country',
                value: country,
                setter: setCountry,
              },
              {
                label: 'City',
                value: city,
                setter: setCity,
              },
              {
                label: 'Street',
                value: street,
                setter: setStreet,
              },
              {
                label: 'Postal Code',
                value: postal,
                setter: setPostal,
              },
            ].map((field, index) => (
              <div key={index} className='flex flex-col gap-2'>
                <label className='text-sm font-semibold'>
                  {field.label}
                </label>

                <input
                  type='text'
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                />
              </div>
            ))}

            {[
              {
                label: 'Next of Kin full names',
                value: names,
                setter: setNames,
              },
              {
                label: 'Next of Kin relationship',
                value: relationship,
                setter: setRelationship,
              },
              {
                label: 'Next of Kin phone number',
                value: phone,
                setter: setPhone,
              },
            ].map((field, index) => (
              <div key={index} className='flex flex-col gap-2'>
                <label className='text-sm font-semibold'>
                  {field.label}
                </label>

                <input
                  type='text'
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                />
              </div>
            ))}
          </div>

          <div className='flex gap-3 items-center'>
              <button 
               type='submit'
               disabled={isUploading}
               className='bg-primary text-white px-4 py-2 font-medium rounded-lg w-fit cursor-pointer hover:bg-transparent hover:border-dark hover:border hover:text-dark'>
                {isUploading ? 'Updating...' : 'Update Profile'}
              </button>

              <button 
               type='button' 
               onClick={() => setActiveTab('AdminProfile')}
               className='border border-dark bg-transparent rounded-lg w-fit px-4  cursor-pointer py-2 hover:border-none hover:bg-orange-400'
                >
                Cancel
              </button>
            </div>
        </form>
      )}
    </div>
  )
}

export default EditAdminProfile