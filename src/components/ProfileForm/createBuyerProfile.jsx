import React, { useState, useRef } from 'react';
import './profile.css';
import { toast, Toaster } from 'react-hot-toast';
import { useProfile } from '../../Hooks/useProfile';
import UploadProfileImg from '../../utils/ProfileImgUpload';
import { useCurrentUser } from '../../Hooks/useCurrentUser';

const IntialFormState = {
  fullname: '',
  phone: '',
  addresses: [
    {
      label: '',
      country: '',
      city: '',
      street: '',
      postalCode: '',
    }
  ],
  preferences: {
    currency: '',
    language: '',
    notification: {
      email: false,
      sms: false,
      push: false,
    }
  },
  /*avatar: '',
  avatarId: '',*/
}
function CreateBuyerProfile() {
  const { data:me, isLoading: meLoading } = useCurrentUser();
  const role = me?.role;
  const { profile, createProfile } = useProfile(role);

  if (meLoading) return null;

  const [avatar, setAvatar] = useState(null);
  const [isDraging, setIsDragging] = useState(false);
  const [form, setForm] = useState(IntialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [ImgErr, setImgErr] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const avatarRef = useRef();

  const MAX_IMG_SIZE = 5;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file && file.size > MAX_IMG_SIZE * 1024 * 1024){
      setImgErr('Avatar image exceeds 5MB limit');
      return;
    }
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = async (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name] : e.target.value
    }));
  }

  const handleDragOverAvatar = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleAvatarDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if(file && file.type.startsWith('image/')){
      handleAvatarChange({
        target: {
          files: [file]
        }
      });
    }
  };

  const handleDragLeaveAvatar = () => {
    setIsDragging(false);
  }

  const handleDiscard = () => {
    setPreview(null);
    setAvatar(null);
    setForm(IntialFormState);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try{
      const { url, fileId } = await UploadProfileImg(avatar, role)

      const payload = {
        ...form,
        avatar: url,
        avatarId: fileId,
      };

      console.log(payload);

      await createProfile(payload);
      setAvatar(null);
      setForm(IntialFormState);
      setSuccess('Profile Saved');
      toast.success('Profile Saved');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error(error);
      setError(error.message || 'Failed to create profile.');
      toast.error(error.response?.data?.message || 'Error creating profile');      
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  }

  /*const handleUpload = async (file) => {
    const image = await UploadProfileImg(file, me.role);
  }*/
  return (
    <div>
     <Toaster position='top-right' reverseOrder={false}/>
     <p className='text-secondary'>createBuyerProfile009</p>
    </div>
  )
}

export default CreateBuyerProfile