import { getProfileFolderByRole } from './imageKitFolders';
import axios from 'axios';
import { Api } from '.';

const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL
const PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY

const imagekit = axios.create({
  baseURL: IMAGEKIT_URL,
  withCredentials: false,
})

const UploadProfileImg = async (file, role) => {

  const folder = getProfileFolderByRole(role);

  // On getting upload token from backend
  const authRes = await Api.get('/imgAuth/Upload-auth');
  const { signature, token, expire } = authRes.data;

  if (!signature || !token || !expire ){
    throw new Error('Invalid Imagekit auth response');
  }

  // On uploading files using ImageKit API
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('publicKey', PUBLIC_KEY);
  formData.append('folder', folder);
  formData.append('signature', signature);
  formData.append('token', token);
  formData.append('expire', expire);

  const res = await imagekit.post('/files/upload', formData);

  if (!res.data?.url || !res.data?.fileId){
    throw new Error('Image upload failed!');
  }

  return {
    url: res.data.url,
    fileId: res.data.fileId,
  };
};

export default UploadProfileImg;