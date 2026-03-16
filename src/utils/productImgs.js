import axios from 'axios';
import { Api } from '.';

const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL;
const PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KE;

const imagekit = axios.create({
  baseURL: IMAGEKIT_URL,
  withCredentials: false,
});

const uploadProductImgs = async (files, vendorId) => {
  const fileArray = Array.isArray(files) ? files : [files];

  const folder = import.meta.env.VITE_IMAGEKIT_VENDOR_PRODUCTS;

  const authRes = await Api.get('/imgAuth/upload-auth');
  const { signature, token, expire } = authRes.data;

  if (!signature || !token || !expire) {
    throw new Error('Invalid Imagekit auth response');
  }

  const uploads = fileArray.map(async (file) => {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('publicKey', PUBLIC_KEY);
    formData.append('folder', folder);

    formData.append('signature', signature);
    formData.append('token', token);
    formData.append('expire', expire);

    formData.append('useUniqueFileName', true);
    formData.append('tags', `product,vendor_${vendorId}`);

    const res = await imagekit.post('/files/upload'. formData);

    if (!res.data?.url || !res.data?.fileId) {
      throw new Error('Image upload failed');
    }

    return { 
      url: res.data.url,
      fileId: res.data.fileId,
      name: res.data.name,
    };
  });

  const results = await Promise.all(uploads);

  // If a single img was passed, return a single object
  return Array.isArray(files) ? results : results[0];
};

export default uploadProductImgs;