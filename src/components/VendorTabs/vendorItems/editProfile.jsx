import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import UploadProfileImg from '../../../utils/ProfileImgUpload';
import { AdLoader } from '../../';

function EditVendorProfile({ profile, user, onUpdate, setActiveTab }) {
  // logo,banner, legalName||storeName, description, phone, country,  city, postal,street, payout.till, 
  const [legalName, setLegalName] = useState(user?.storeName || '');
  const [description, setDescription] = useState(profile?.store?.description || '');
  const [phone, setPhone] = useState(profile?.store?.contactPhone || '');
  const [country, setCountry] = useState(profile?.store?.addresses?.country || '');
  const [city, setCity] = useState(profile?.store?.addresses?.city || '');
  const [postal, setPostal] = useState(profile?.store?.addresses?.postal || '');
  const [street, setStreet] = useState(profile?.store?.addresses?.street || '');
  const [tillNumber, setTillNumber] = useState(profile?.payout?.tillNumber || '');
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState({
    logo: { file: null, preview: null, error: '' },
    banner: { file: null, preview: null, error: '' }
  })

  useEffect(() => {
    return () => {
      Object.values(images).forEach(img => {
        if (img.preview && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  const MAX_IMG_SIZE = 5;

  const updateImgState = (key, updates) => {
    setImages(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates
      }
    }));
  };

  const handleImageChange = (key, file) => {
    if (!file) return;

    if (file.size > MAX_IMG_SIZE * 1024 * 1024){
      updateImgState(key, {
        error: `Image exceeds ${MAX_IMG_SIZE}MB limit`
      });
      return;
    }

    if (images[key].preview && images[key].preview.startsWith('blob:')) {
      URL.revokeObjectURL(images[key].preview);
    }

    const newPreview = URL.createObjectURL(file);

    updateImgState(key, {
      file,
      preview: newPreview,
      error: ''
    });
  };

  const handleDiscard = (key) => {
    if (images[key].preview &&
      images[key].preview.startsWith('blob:')) {
      URL.revokeObjectURL(images[key].preview);
    }

    updateImgState(key, {
      file: null,
      preview: '',
      error: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const uploadedImgs = {}

      for (const key of ['logo', 'banner']) {
        const img = images[key];

        if (img.file) {
          const { url, fileId } = await UploadProfileImg(img.file, user.role);
          uploadedImgs[key] = url;
          uploadedImgs[`${key}Id`] = fileId;
        }
      }

      const payload = {
        legalName,
        description,
        phone,
        addresses: {
          country,
          city,
          postal,
          street
        },
        payout: {
          tillNumber
        },
        ...uploadedImgs
      };
      //console.log(payload)
      await onUpdate(payload);
      setActiveTab('VendorProfile');
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className='flex flex-col'>
      <div className='flex items-center justify-between'>
        <FaArrowLeft 
          onClick={() => setActiveTab('VendorProfile')}
          className='text-dark hover:text-primary cursor-pointer VenSettIcon'
          size={25}
        />
        <h1 className='text-dark font-semibold text-lg SettVenTabsd'>
          Update Profile
        </h1>
      </div>

      {isUploading && (
        <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
          <AdLoader />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div className='flex flex-col gap-2 border rounded-lg p-3 min-w-0'>
            <label>Store Logo</label>

            {images.logo.preview && (
              <img
                src={images.logo.preview}
                alt='Logo review'
                className='h-24 w-24 rounded-full object-cover border'
              />
            )}

            <input
              type='file'
              accept='image/*'
              onChange={e => 
                handleImageChange(
                  'logo',
                  e.target.files[0]
                )
              }
              className='text-primary cursor-pointer'
            />

            {images.logo.error && (
              <p className='text-red-500 text-sm cursor-pointer'>
                {images.logo.error}
              </p>
            )}

            {images.logo.preview && (
              <button
                type='button'
                onClick={() => handleDiscard('logo')}
                className='w-fit text-red-500 text-sm'
                >
                  Remove logo
              </button>
            )}
          </div>

          <div className='flex flex-col gap-2 border rounded-lg p-3 min-w-0'>
            <label>Banner</label>

            {images.banner.preview && (
              <img
                src={images.banner.preview}
                alt='Banner preview'
                className='h-32 w-full rounded-lg object-cover border'
              />
            )}

            <input
              type='file'
              accept='image/*'
              onChange={e => 
                handleImageChange(
                  'banner',
                  e.target.files[0]
                )
              }
              className='text-primary cursor-pointer'
            />

            {images.banner.error && (
              <p className='text-red-500 text-sm'>
                {images.banner.error}
              </p>
            )}

            {images.banner.preview && (
              <button
                type='button'
                onClick={() => handleDiscard('banner')}
                className='w-fit text-red-500 text-sm cursor-pointer'
                >
                  Remove banner
              </button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold'>StoreName</label>
            <input
              type='text'
              required
              value={legalName}
              onChange={e => setLegalName(e.target.value)}
              className='w-full p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold'>Phone</label>
            <input
              type='text'
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className='w-full p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold'>Till Number</label>
            <input
              type='text'
              required
              value={tillNumber}
              onChange={e => setTillNumber(e.target.value)}
              className='w-full p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold'>Country</label>
            <input
              type='text'
              required
              value={country}
              onChange={e => setCountry(e.target.value)}
              className='w-full p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold'>City</label>
            <input
              type='text'
              required
              value={city}
              onChange={e => setCity(e.target.value)}
              className='w-full p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold'>Street</label>
            <input
              type='text'
              required
              value={street}
              onChange={e => setStreet(e.target.value)}
              className='w-full p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold'>Postal</label>
            <input
              type='text'
              required
              value={postal}
              onChange={e => setPostal(e.target.value)}
              className='w-full p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
            />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold'>Description</label>
          <textarea
            type='text'
            required
            rows={6}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className='w-full p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
          />
        </div>

        <div className='flex gap-3 items-center'>
          <button className='bg-primary text-white px-4 py-2 font-medium rounded-lg w-fit cursor-pointer hover:bg-transparent hover:border-dark hover:border hover:text-dark'>
            {isUploading ? 'Updating...' : 'Update Profile'}
          </button>

          <button 
            type='button' 
            onClick={() => setActiveTab('VendorProfile')}
            className='border border-dark bg-transparent rounded-lg w-fit px-4  cursor-pointer py-2 hover:border-none hover:bg-orange-400'
            >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

export default EditVendorProfile