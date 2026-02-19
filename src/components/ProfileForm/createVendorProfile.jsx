import React, { useState, useEffect, useRef } from 'react';
import './profile.css';
import { toast, Toaster } from 'react-hot-toast';
import { useProfile } from '../../Hooks/useProfile';
import UploadProfileImg from '../../utils/ProfileImgUpload';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { WLoader } from '..';
import { FaCamera } from 'react-icons/fa';
import { GiTatteredBanner } from "react-icons/gi";

const InitialFormState = {
  businessInfo: [
    {
      legalName: '',
      registrationNumber: '',
      taxId: '',
    }
  ],
  store: [
    {
      //storeName: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      addresses: [
        {
          country: '',
          city: '',
          street: '',
          postal: '',
        }
      ]
    }
  ],
  payout: [
    {
      method: '',
      accountName: '',
      accountNumber: '',
      provider: '',
      paybill: '',
      paybillAcc: '',
      tillNumber: '',
      pochiLaBiashara: '',
    }
  ],
  socialLinks: [
    {
      instagram: '',
      facebook: '',
      x: '',
      website: ''
    }
  ],
  /*logo: '',
  logoId: '',
  banner: '',
  bannerId: '',*/
}

function CreateVendorProfile() {
  const { data:me, isLoading: meLoading } = useCurrentUser();
  const role = me?.role;
  const { profile, createProfile } = useProfile(role);

  if (meLoading) return null;

  const [images, setImages] = useState({
    logo: { file: null, preview: null, error: '', dragging: false },
    banner: { file: null, preview: null, error: '', dragging: false }
  });

  const [form, setForm] = useState(InitialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const logoRef = useRef();
  const bannerRef = useRef();

  useEffect(() => {
    return () => {
      Object.values(images).forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  const MAX_IMG_SIZE = 5;

  const updateImageState = (key, updates) => {
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
      updateImageState(key, {
        error: `Image exceeds ${MAX_IMG_SIZE}MB limit`
      });
      return;
    }

    if (images[key].preview) {
      URL.revokeObjectURL(images[key].preview);
    }

    const newPreview = URL.createObjectURL(file);

    updateImageState(key, {
      file,
      preview: newPreview,
      error: ''
    });
  };
  
  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    handleImageChange(key, file);
  }

  const handleDragOver = (key, e) => {
    e.preventDefault();
    updateImageState(key, { dragging: true });
  };

  const handleDragLeave = (key) => {
    updateImageState(key, { dragging: false });
  };

  const handleDrop = (key, e) => {
    e.preventDefault();
    updateImageState(key, { dragging: false });

    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith('image/')) {
      handleImageChange(key, file);
    }
  };

  const handleDiscard = (key) => {
    if (images[key].preview) {
      URL.revokeObjectURL(images[key].preview);
    }

    updateImageState(key, {
      file: null,
      preview: null,
      error:'',
      dragging: false,
    });
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
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const uploadedImages = {};

      for (const key of ['logo', 'banner']) {
        const img = images[key];

        if (img.file) {
          const { url, fileId } = await UploadProfileImg(img.file, role);
          uploadedImages[key] = url;
          uploadedImages[`${key}Id`] = fileId;
        }
      }

      const payload = {
        ...form,
        ...uploadedImages
      };

      console.log('Payload', payload);
      
      await createProfile(payload);

      setForm(InitialFormState);
      setImages({
        logo: { file: null, preview: null, error: '', dragging: false },
        banner: { file: null, preview: null, error: '', dragging: false }
      });

      setSuccess('Profile saved successfully!');
      toast.success('Profile saved successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Failed to add vendor profile', error);
      setError(error.message || 'Failed to create vendor profile');
      toast.error(error.response?.data?.message || 'Error creating vendor profile');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Toaster position='top-right' reverseOrder={false}/>
      {isLoading ? (
        <WLoader/>
      ) : (
        <div className='rounded-xl bg-white mt-3 w-full p-4 overflow-y-auto'>
          <h1 className='text-medium text-xl text-dark'>
            Add Profile
          </h1>
          <p className='text-normal text-md text-dark flex items-center gap-1'>
            All fields marked with <span className='text-red-600'>*</span> are required
          </p>
          <form className='flex flex-col mt-2 mb-2 w-full' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-3 my-1'>
              <p className='text-md font-normal leading-relaxed my-1'>
                {`Maximum single image file size is ${MAX_IMG_SIZE}MB`}
                {error && <p className='text-red-600'>{error}</p>}
              </p>
            </div>

            <div className='flex gap-2'>
              <div 
                onDrop={(e) => handleDrop('logo', e)}
                onDragOver={(e) => handleDragOver('logo', e)}
                onDragLeave={() => handleDragLeave('logo', e)}
                className={`relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-full cursor-pointer transition ${images.logo.dragging ? 'border-dark bg-[#405889]' : 'border-gray-300'}`}
                onClick={() => logoRef.current.click()}
                >
                  {images.logo.preview ? (
                    <>
                      <img
                        src={images.logo.preview}
                        alt='Logo preview'
                        className='w-full h-full object-cover rounded-full shadow-md'
                        loading='lazy'
                      />
                      <button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDiscard('logo');
                        }}
                        className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full p-1 flex items-center justify-center cursor-pointer'
                        >
                          X
                      </button>
                    </>
                  ) : (
                    <div className='flex flex-col items-center justify-center w-full h-full cursor-pointer'>
                      <FaCamera className='text-gray-400' size={20} />
                      <p className=' text-xs text-gray-500 mt-1 flex items-center'> 
                        Upload logo <span className='text-red-600'>*</span>
                      </p>
                      {images.logo.error && <p className="text-red-500 text-xs mt-1">
                        {images.logo.error}
                      </p>}
                    </div>
                  )}

                  <input
                    type='file'
                    required
                    accept='image/*'
                    ref={logoRef}
                    onChange={(e) => handleFileChange('logo', e)}
                    className='hidden'
                  />
                </div>
            </div>

            <div className='flex gap-2 mt-4'>
              <div 
                onDrop={(e) => handleDrop('banner', e)}
                onDragOver={(e) => handleDragOver('banner', e)}
                onDragLeave={() => handleDragLeave('banner', e)}
                className={`relative flex flex-col items-center justify-center w-full h-35 border-2 border-dashed rounded-md cursor-pointer transition ${images.banner.dragging ? 'border-dark bg-[#405889]' : 'border-gray-300'}`}
                onClick={() => bannerRef.current.click()}
                >
                  {images.banner.preview ? (
                    <>
                      <img
                        src={images.banner.preview}
                        alt='Banner preview'
                        className='w-full h-full object-cover rounded-md shadow-md'
                        loading='lazy'
                      />
                      <button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDiscard('banner');
                        }}
                        className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full p-1 flex items-center justify-center cursor-pointer'
                        >
                          X
                      </button>
                    </>
                  ) : (
                    <div className='flex flex-col items-center justify-center w-full h-full cursor-pointer'>
                      <GiTatteredBanner  className='text-gray-400' size={35} />
                      <p className=' text-md text-gray-500 mt-1 flex items-center'> 
                        Upload banner<span className='text-red-600'>*</span>
                      </p>
                      {images.banner.error && <p className="text-red-500 text-xs mt-1">
                        {images.banner.error}
                      </p>}
                    </div>
                  )}

                  <input
                    type='file'
                    required
                    accept='image/*'
                    ref={bannerRef}
                    onChange={(e) => handleFileChange('banner', e)}
                    className='hidden'
                  />
                </div>
            </div>

          </form>
        </div>
      )}
    </div>
  )
}

export default CreateVendorProfile