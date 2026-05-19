import React from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import UploadProfileImg from '../../../utils/ProfileImgUpload';
import { AdLoader } from '../../';

function EditVendorProfile({ profile, users, onUpdate, setActiveTab }) {
  return (
    <section className='p-4 flex flex-col space-y-2'>
      <div className='flex items-center justify-between'>
        <FaArrowLeft 
        onClick={() => setActiveTab('VendorProfile')}
          className='text-dark hover:text-primary cursor-pointer'
          size={25}
        />
        <h1 className='text-dark font-semibold text-lg'>
          Update Profile
        </h1>
      </div>
    </section>
  )
}

export default EditVendorProfile