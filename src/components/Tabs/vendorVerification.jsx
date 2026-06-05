import React, { useState, useEffect, useRef } from 'react';
import './Tabs.css';
import { CgProfile } from "react-icons/cg";
import { VendorTerms } from '../../commons';
import { toast, Toaster } from 'react-hot-toast';
import useVerification from '../../Hooks/useVerification';
import UploadVerificationImgs from '../../utils/verificationDoc';

function VendorVerification() {
  const { getMyVerification, submitVerification, resubmitVerification, getAllVerification } = useVerification();
  const verification = getMyVerification.data;
  const isLoading = getMyVerification.isLoading;

  const [verificationFiles, setVerificationFiles] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [signature, setSignature] = useState('');
  const [imgErr, setImgErr] = useState();

  const verifyRef = useRef();
  const MAX_IMG_SIZE = 5;

  // On preventing memory leaks
  useEffect(() => {
    return () => {
      verificationFiles.forEach((item) =>
      URL.revokeObjectURL(item.preview)
    )};
  }, [verificationFiles]);

  if (isLoading) return <p>Loading verification info...</p>

  const vendorUser = verification?.verificationId;
  const userStatus = vendorUser?.status || 'pending'

  if (userStatus === 'approved') {
    return (
      <div className='p-4 bg-green-50 border border-green-400 rounded-lg mt-5'>
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

  if (vendorUser && userStatus == 'pending'){
    return (
      <div className='p-4 bg-yellow-50 border border-green-300 rounded-lg'>
        <h3 className='font-medium text-green-800 mb-2'>
          Verification for this profile is already submitted. Awaiting Admin approval.
        </h3>
      </div>
    );
  }

  const handleVerifyDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    handleVerifyImgChange({
      target: { files },
    })
  };

  const handleDragOverVerify = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleVerifyImgChange = (e) => {
    let files = Array.from(e.target.files);

    if (files.length + verificationFiles.length > 4) {
      toast.error('maximum 4 images allowed');
      //setImgErr('maximum 4 images allowed');
      files = files.slice(0, 4 - verificationFiles.length);
    }

    const validFiles = files.filter(
      (file) => 
        file.type.startsWith('image/') && 
        file.size <= MAX_IMG_SIZE * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error('Some files were invalid or exceeded 5MB');
      //setImgErr('Some files were invalid or exceeded 5MB');
    }

    const newFiles = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setVerificationFiles((prev) => [
      ...prev,
      ...newFiles
    ]);
  };

  const removeImage = (indexToRemove) => {
    setVerificationFiles((prev) => {
      const updated = [...prev];

      URL.revokeObjectURL(updated[indexToRemove].preview);

      updated.splice(indexToRemove, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) return toast.error('You must accept vendor agreement!')
    if (verificationFiles.length === 0)
      return toast.error('Please upload your verification documents!');

    try{
      //const toastId = toast.loading('Submitting verification docs...');

      const uploadedFiles = await UploadVerificationImgs(
        verificationFiles.map((item) => item.file)
      );

      const verificationFilesPayload = uploadedFiles.map((f) => ({
        url: f.url,
        fileId: f.fileId,
      }));

      const payload = {
        verificationFiles: verificationFilesPayload,
        termsConditions: termsAccepted,
        signature,
      };

      const onSuccess = () => {
        //toast.success('verification submitted. Awaiting Admin approval', { id: toastId});
        setVerificationFiles([]);
        setSignature('');
        setTermsAccepted(false);
      }

      if (userStatus === 'rejected') {
        resubmitVerification.mutate(payload, { onSuccess});
      } else {
        submitVerification.mutate(payload, { onSuccess });
      }
    } catch(error){
      console.error('Verification docs upload failed', error);
      //toast.error('Failed to upload verification docs!');
    }
  };
  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />
      <div className='mx-auto p-4 bg-yellow-50 border border-yellow-300 rounded-lg verifyCon'>
        <h3 className='text-lg font-semibold mb-4'>
          {userStatus === 'rejected' ? 'Resubmit your verification' : 'Vendor Verification'}
        </h3>

        {userStatus === 'rejected' && vendorUser.rejectionReason && (
          <div className='mb-4 p-2 bg-red-100 text-red-800 rounded'>
            <strong> Rejection Reason:</strong> {vendorUser.rejectionReason}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-3 my-2'>
            <p className='text-xs leading-relaxed my-1'>
              Maximum single image file is 5MB
              { imgErr && <p className='text-red-600'>{imgErr}</p>}
            </p>
          </div>

          <div className='flex flex-col gap-2'>
            <div 
              onDrop={handleVerifyDrop}
              onDragOver={handleDragOverVerify}
              onDragLeave={handleDragLeave}
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded cursor-pointer transition-all duration-200 
               ${
                isDragging 
                  ? 'border-blue-400 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
                }`
              }
              >
                <label
                  htmlFor='VerifyImgs'
                  className='flex flex-col items-center justify-center w-full h-full cursor-pointer'>
                    <CgProfile className='w-8 h-8 text-gray-500'/>
                    <p className='mt-2 text-sm  flex gap-1 items-center font-semibold text-gray-500 IDText'>
                      Add National ID/Passport <span className='text-red-600 text-base'>*</span>
                    </p>
                    <p className="text-xs text-gray-400 IDText">
                      Max 4 images • 5MB each
                    </p>
                </label>
                <input
                  id='VerifyImgs'
                  type='file'
                  multiple
                  accept='images/*'
                  onChange={handleVerifyImgChange}
                  ref={verifyRef}
                  className='hidden'
                />
              </div>
              {verificationFiles.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-3'>
                  {verificationFiles.map((item, index) => (
                    <div key={index} className='relative'>
                      <img
                        src={item.preview}
                        alt={`verification-${index}`}
                        className='w-24 h-20 object-cover rounded shadow-md'
                      />

                      <button 
                        type='button'
                        onClick={() => removeImage(index)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-600 cursor-pointer'>
                          X
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </div>
          <div className="space-y-4 " id='Why Us'>
            <details className="group [&_summary::-webkit-details-marker]:hidden transition ease-in duration-700 ">
                <summary
                    className="flex items-center justify-between gap-1 rounded-md p-1"
                >
                    <h2 className="text-base cursor-pointer text-orange-600 hover:underline font-medium">Vendor agreement</h2>

                    <svg
                    className="size-5 shrink-0 transition-transform cursor-pointer duration-300 text-[#070707] group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </summary>

                <div className='flex flex-col gap-2'>
                  <div className='vendor-terms-container'>
                    {VendorTerms.map((term) => (
                      <div 
                        key={term.id}
                        className='vendor-term'
                        >
                          <h3 className='term-title p-2 text-primary '>{term.title}</h3>
                          <p className='term-text p-2 text-md'>{term.text}</p>
                        </div>
                    ))}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='flex items-center gap-1'>Signature <span className='text-red-600'>*</span></label>
                    <span className='text-xs text-red-500'>Please ensure the signature matches the full name as it appears on the ID or Passport.</span>
                    <input
                      type='text'
                      value={signature}
                      required
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder='Enter your full signature'
                      className='border-b-[1.5px] border-b-dark my-2 focus:outline-0'
                    />
                  </div>
                </div>
            </details>
          </div>

          <label className='flex items-center gap-2 font-normal Agreement'>
            <input
              type='checkbox'
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            I have read and I agree to the vendor agreement stated.
          </label>

          <button 
            type='submit'
            className='px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 cursor-pointer'
            disabled={submitVerification.isLoading || resubmitVerification.isLoading}
            >
              {userStatus === 'rejected' ? 'Resubmit verification' : 'Submit verification'}
            </button>
        </form>
      </div>
    </>
  );
}

export default VendorVerification