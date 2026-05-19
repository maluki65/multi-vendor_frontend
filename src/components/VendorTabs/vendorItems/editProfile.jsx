import React from 'react';
import { FaArrowLeft } from "react-icons/fa6";

function EditVendorProfile({ activeTab, setActiveTab }) {
  return (
    <div>
      <FaArrowLeft 
       onClick={() => setActiveTab('VendorProfile')}
        className='text-dark hover:text-primary cursor-pointer'
        size={25}
       />
      EditVendorProfile
    </div>
  )
}

export default EditVendorProfile