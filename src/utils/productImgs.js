import axios from 'axios';
import { Api } from '.';

const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL;
const PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

const imagekit = axios.create({
  baseURL: IMAGEKIT_URL,
  withCredentials: false,
});

const uploadProductImgs = async (files, vendorId) => {
  const fileArray = Array.isArray(files) ? files : [files];
  const folder = import.meta.env.VITE_IMAGEKIT_VENDOR_PRODUCTS;

  const sanitizeFileName = (name) => {
    return name
      .replace(/[^\w.-]/g, '_')
      .replace(/_+/g, '_');
  };

  const uploads = fileArray.map(async (file) => {
    // On getting a fresh signed token for each file
    const authRes = await Api.get('/imgAuth/upload-auth');
    const { signature, token, expire } = authRes.data;

    if (!signature || !token || !expire) {
      throw new Error('Invalid ImageKit auth response');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', sanitizeFileName(file.name));
    formData.append('folder', folder);
    formData.append('publicKey', PUBLIC_KEY); 
    formData.append('signature', signature);
    formData.append('token', token);
    formData.append('expire', expire);
    formData.append('useUniqueFileName', true);
    formData.append('tags', `product,vendor_${vendorId}`);

    const res = await imagekit.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!res.data?.url || !res.data?.fileId) {
      throw new Error('Image upload failed');
    }

    return { url: res.data.url, fileId: res.data.fileId, name: res.data.name };
  });

  return await Promise.all(uploads);
};

export default uploadProductImgs;