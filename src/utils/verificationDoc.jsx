import { Api } from '.';
import axios from 'axios';

const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL;
const PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const FOLDER = import.meta.env.VITE_IMAGEKIT_VERIFICATIONIMGS;

const imagekit = axios.create({
  baseURL: IMAGEKIT_URL,
  withCredentials: false,
});

const uploadSingleImage =  async(file) => {
  const authRes = await Api.get('/imgAuth/Upload-auth');
  const { signature, token, expire } = authRes.data;

  if (!signature || !token || !expire) {
    throw new Error('Invalid Imagekit auth response');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('publicKey', PUBLIC_KEY);
  formData.append('folder', FOLDER);
  formData.append('signature', signature);
  formData.append('token', token);
  formData.append('expire', expire);

  const res = await imagekit.post('/files/upload', formData);

  if (!res.data?.url || !res.data?.fileId) {
    throw new Error('Image upload failed');
  }

  return {
    url: res.data.url,
    fileId: res.data.fileId,
  };
};

const UploadVerificationImgs = async (files = []) => {
  if (!Array.isArray(files) || files.length === 0) return [];

  const uploads = files.map((file) => uploadSingleImage(file));

  return await Promise.all(uploads);
};

/*const UploadVerificationImgs = async(files = []) => {
  const results = [];

  for (const file of files) {
    const uploaded = await uploadSingleImage(file);
    results.push(uploaded);
  }

  return results;
}*/

export default UploadVerificationImgs