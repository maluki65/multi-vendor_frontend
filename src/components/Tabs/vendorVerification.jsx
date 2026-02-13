import React, { useState } from 'react';
import './Tabs.css';
import { toast, Toaster } from 'react-hot-toast';
import useVerification from '../../Hooks/useVerification';
import UploadVerificationImgs from '../../utils/verificationDoc';

function VendorVerification() {
  const { getMyVerification, submitVerification, resubmitVerification, getAllVerification } = useVerification();
  const verification = getMyVerification.data;
  const isLoading = getMyVerification.isLoading;

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  if (isLoading) return <p>Loading verification info...</p>

  const vendorUser = verification?.verificationId;
  const userStatus = vendorUser?.status || 'pending'

  if (userStatus === 'approved') {
    return (
      <div className='p-4 bg-green-50 border border-green-400 rounded-lg'>
        <h3 className='font-semibold text-green-800 mb-2'>
         Your vendor account is approved
        </h3>
        <p className='text-sm text-green-700'>
          You are verified! You can now manage your store and listings.
        </p>
        <div className='mt-4 space-y-1'>
          <p><strong>Store Name:</strong> {vendorUser.storeName} </p>
          <p><strong>Email:</strong> {vendorUser.email} </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) return toast.error('You must accept vendor agreement!')
    if (selectedFiles.length === 0)
      return toast.error('Please upload your verification documents!');

    try{
      const uploadedFiles = await UploadVerificationImgs(selectedFiles);

      const verificationImg = uploadedFiles.map(f => f.url);
      const verificationImgIds = uploadedFiles.map(f => f.fileId);

      const payload = {
        verificationImg,
        verificationImgIds,
        termsConditions: termsAccepted,
      };

      if (userStatus === 'rejected') {
        resubmitVerification.mutate(payload);
      } else {
        submitVerification.mutate(payload);
      }
    } catch(error){
      console.error('Verification docs upload failed', error);
      toast.error('Failed to upload verification docs!');
    }
  };
  return (
    <div className='max-w-lg mx-auto p-4 bg-yellow-50 border border-yellow-300 rounded-lg'>
      <h3 className='text-lg font-semibold mb-4'>
        {userStatus === 'rejected' ? 'Resubmit your verification' : 'Vendor Verifcation'}
      </h3>

      {userStatus === 'rejected' && vendorUser.rejectionReason && (
        <div className='mb-4 p-2 bg-red-100 text-red-800 rounded'>
          <strong> Rejection Reason:</strong> {vendorUser.rejectionReason}
        </div>
      )}

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          type='file'
          multiple
          accept='images/*'
          onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
        />

        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          I have read and agree to the vendor agreement stated
        </label>

        <button 
          type='submit'
          className='px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50'
          disabled={submitVerification.isLoading || resubmitVerification.isLoading}
          >
            {userStatus === 'rejected' ? 'Resubmit verification' : 'Submit verification'}
          </button>
      </form>
    </div>
  );
}

export default VendorVerification