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
  businessInfo: {
      legalName: '',
      registrationNumber: '',
      taxId: '',
    },
  store:  {
    //storeName: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    addresses:  {
      country: '',
      city: '',
      street: '',
      postal: '',
    }
  },
  payout: {
    method: '',
    bank: '',
    accountName: '',
    accountNumber: '',
    provider: '',
    paybill: '',
    paybillAcc: '',
    tillNumber: '',
    pochiLaBiashara: '',
  },
  socialLinks: {
    instagram: '',
    facebook: '',
    x: '',
    tiktok: '',
    //website: ''
  },
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

    if (!images.logo.file || !images.banner.file) {
      toast.error('Logo and banner are required');
      setIsLoading(false);
      return;
    }

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

      //console.log('Payload', payload);
      
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
          <p className='text-normal text-md text-dark flex items-center gap-1 markedT'>
            All fields marked with <span className='text-red-600'>*</span> are required
          </p>
          <form className='flex flex-col mt-2 mb-2 w-full' onSubmit={handleSubmit}>
          <div className='text-md font-normal leading-relaxed my-1 markedT'>
            <p>{`Maximum single image file size is ${MAX_IMG_SIZE}MB`}</p>
            {error && <p className='text-red-600'>{error}</p>}
          </div>

            <div className='flex gap-2 VenImgCon'>
              <div 
                onDrop={(e) => handleDrop('logo', e)}
                onDragOver={(e) => handleDragOver('logo', e)}
                onDragLeave={(e) => handleDragLeave('logo', e)}
                className={`relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-full cursor-pointer transition VendImg ${images.logo.dragging ? 'border-dark bg-[#405889]' : 'border-gray-300'}`}
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
                      <FaCamera className='text-gray-400 VenIcon' size={20} />
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
                    accept='image/*'
                    ref={logoRef}
                    onChange={(e) => handleFileChange('logo', e)}
                    className='hidden'
                  />
                </div>
            </div>

            <div className='flex gap-2 my-4'>
              <div 
                onDrop={(e) => handleDrop('banner', e)}
                onDragOver={(e) => handleDragOver('banner', e)}
                onDragLeave={() => handleDragLeave('banner', e)}
                className={`relative flex flex-col items-center justify-center w-full h-35 border-2 border-dashed rounded-md cursor-pointer transition VenBanner ${images.banner.dragging ? 'border-dark bg-[#405889]' : 'border-gray-300'}`}
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
                    accept='image/*'
                    ref={bannerRef}
                    onChange={(e) => handleFileChange('banner', e)}
                    className='hidden'
                  />
                </div>
            </div>

            <div className='grid grid-cols-3 gap-2 my-3 space-y-2 VenRegCon'>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Store legalName <span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='businessInfo.legalName'
                  placeholder='Sellory'
                  required
                  value={form.businessInfo.legalName}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Registration number {/*<span className='text-red-600'>*</span>*/}</label>
                <input
                  type='text'
                  name='businessInfo.registrationNumber'
                  placeholder='A0884..'
                  value={form.businessInfo.registrationNumber}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>TaxId<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='businessInfo.taxId'
                  required
                  placeholder='KRA pin A0793...'
                  value={form.businessInfo.taxId}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Store description<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='store.description'
                  required
                  placeholder='we sell...'
                  value={form.store.description}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Contact email<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='store.contactEmail'
                  required
                  placeholder='store@gmail.com'
                  value={form.store.contactEmail}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Contact phone<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='store.contactPhone'
                  required
                  placeholder='+254 7...'
                  value={form.store.contactPhone}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Country<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='store.addresses.country'
                  required
                  placeholder='Kenya..'
                  value={form.store.addresses.country}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>City<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='store.addresses.city'
                  required
                  placeholder='Nairobi'
                  value={form.store.addresses.city}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Street<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='store.addresses.street'
                  required
                  placeholder='Kenyatta ave..'
                  value={form.store.addresses.street}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='flex items-center gap-2 text-sm'>Postal code<span className='text-red-600'>*</span></label>
                <input
                  type='text'
                  name='store.addresses.postal'
                  required
                  placeholder='00100'
                  value={form.store.addresses.postal}
                  onChange={handleChange}
                  className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                  />
              </div>
            </div>

            <div className='cols-span-3 mt-6 border-t pt-4'>
              <h2 className='text-lg font-medium mb-3'>
                Payout method <span className='text-red-600'>*</span>
              </h2>

              <div className='flex gap-6 mb-4'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input 
                    type='radio'
                    name='payout.method'
                    value='mobile_money'
                    checked={form.payout.method === 'mobile_money'}
                    onChange={handleChange}
                  />
                  M-pesa
                </label>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input 
                    type='radio'
                    name='payout.method'
                    value='Bank'
                    checked={form.payout.method === 'Bank'}
                    onChange={handleChange}
                  />
                  Bank account
                </label>
              </div>

              {form.payout.method === 'mobile_money' && (
                <div className='grid grid-cols-3 gap-3 MonVenPayCon'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Provider</label>
                    <input 
                      type='text'
                      name='payout.provider'
                      placeholder='Safaricom'
                      value={form.payout.provider}
                      onChange={handleChange}
                      className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Till Number</label>
                    <input 
                      type='text'
                      name='payout.tillNumber'
                      placeholder='123456'
                      value={form.payout.tillNumber}
                      onChange={handleChange}
                      className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Paybill business no</label>
                    <input
                      type='text'
                      name='payout.paybill'
                      placeholder='400200'
                      value={form.payout.paybill}
                      onChange={handleChange}
                      className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Paybill account no</label>
                    <input
                      type='text'
                      name='payout.paybillAcc'
                      placeholder='ACC123'
                      value={form.payout.paybillAcc}
                      onChange={handleChange}
                      className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Pochi la Biashara</label>
                    <input
                      type='text'
                      name='payout.pochiLaBiashara'
                      placeholder='07XXXXXXXX'
                      value={form.payout.pochiLaBiashara}
                      onChange={handleChange}
                      className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                  </div>
                </div>
              )}

              {form.payout.method === 'Bank' && (
                <div className='grid grid-cols-3 gap-3 BanVenPayCon'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Bank Name</label>
                    <input
                      type='text'
                      name='payout.bank'
                      placeholder='Equity Bank'
                      value={form.payout.bank}
                      onChange={handleChange}
                      className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Account Name</label>
                    <input
                      type='text'
                      name='payout.accountName'
                      placeholder='John Doe'
                      value={form.payout.accountName}
                      onChange={handleChange}
                      className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Account number</label>
                    <input
                      type='text'
                      name='payout.accountNumber'
                      placeholder='0123456789'
                      value={form.payout.accountNumber}
                      onChange={handleChange}
                      className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                  </div>
                </div>
              )}
            </div>

            <div className='cols-span-3 mt-6 border-t pt-4'>
              <h2 className='text-lg font-medium mb-3'>
                Social Links{/*<span className='text-red-600'>*</span>*/}
              </h2>

              <div className='mb-4 grid grid-cols-3 gap-3 VenSocialCon'>
                <div className='flex flex-col gap-1'>
                  <label className='flex items-center gap-2 text-sm'> Instagram {/*<span className='text-red-600'>*</span>*/}</label>
                  <input
                    type='text'
                    name='socialLinks.instagram'
                    placeholder='https://www.instagram.com/selloryecommerce/'
                    required
                    value={form.socialLinks.instagram}
                    onChange={handleChange}
                    className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                </div>

                <div className='flex flex-col gap-1'>
                  <label className='flex items-center gap-2 text-sm'> FaceBook {/*<span className='text-red-600'>*</span>*/}</label>
                  <input
                    type='text'
                    name='socialLinks.facebook'
                    placeholder='https://www.facebook.com/profile.php?id=61586947749716'
                    required
                    value={form.socialLinks.facebook}
                    onChange={handleChange}
                    className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                </div>

                <div className='flex flex-col gap-1'>
                  <label className='flex items-center gap-2 text-sm'> X{/*<span className='text-red-600'>*</span>*/}</label>
                  <input
                    type='text'
                    name='socialLinks.x'
                    placeholder='https://x.com/Selloryke'
                    required
                    value={form.socialLinks.x}
                    onChange={handleChange}
                    className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                </div>

                <div className='flex flex-col gap-1'>
                  <label className='flex items-center gap-2 text-sm'> TikTok{/*<span className='text-red-600'>*</span>*/}</label>
                  <input
                    type='text'
                    name='socialLinks.tiktok'
                    placeholder='https://www.tiktok.com/@selloryecommerce'
                    required
                    value={form.socialLinks.tiktok}
                    onChange={handleChange}
                    className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                </div>

                {/*<div className='flex flex-col gap-1'>
                  <label className='flex items-center gap-2 text-sm'> Website{/*<span className='text-red-600'>*</span></label>
                  <input
                    type='text'
                    name='socialLinks.website'
                    placeholder='https://www.sellory.com'
                    required
                    value={socialLinks.website}
                    onChange={handleChange}
                    className='p-2 outline-none focus:bg-[#cbcaca] focus:border-[1.5px] rounded-lg bg-[#d7d7d7]'
                    />
                </div>*/}
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

export default CreateVendorProfile