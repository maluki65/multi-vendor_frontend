import React, { useState } from 'react';
import './vendorTabs.css';
import { toast } from 'react-hot-toast';
import useProducts from '../../Hooks/useProduts';
import useCategory from '../../Hooks/useCategory';
import uploadProductImgs from '../../utils/productImgs';

const InitialFormStatus = {
  category: '',
  name: '',
  description: '',
  tag: [],
  price: '',
  quantity: '',
}

function AddProducts() {
  const { createProduct } = useProducts();
  const { getActiveCategories } = useCategory();
  const { data: categories, isLoding } = getActiveCategories;

  const [form, setForm] = useState(InitialFormStatus);
  const [mainImg, setMainImg] = useState(null);
  const [supportImg, setSupportImgs] = useState([]);

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.targett;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMainImg = (e) => {
    setMainImg(e.target.files[0]);
  };

  const handleSupportImg = (e) => {
    setSupportImgs({...e.target.files});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!mainImg){
      return toFormData.error('Main product image is required');
    }

    try{
      setUploading(true);

      const uploadedResults = await uploadProductImgs(mainImg, supportImg);

      const payload = {
        ...form,
        MainIMg: uploadedResults.main.url,
        MainIMgId: uploadedResults.main.fileId,
        supportImgs: uploadedResults.support.map(img => img.url),
        supportImgsId: uploadedResults.support.map(img => img.fileId)
      };

      createProduct.mutate(payload);

      setForm(InitialFormStatus);
      setMainImg(null);
      setSupportImgs([]);

      toast.success('product submitted for moderation');
    } catch (error) {
      console.error('Error creating product...', error);
      toast.error('Error creating product');
    } finally {
      setUploading(false);
    }
  }

  if(isLoding) return <div>Loading categories...</div>;

  return (
    <div>
      <h2 className=''>AddProducts</h2>
      <form onSubmit={handleSubmit} className=''>
        <select
          name='category'
          value={form.category}
          onChange={handleChange}
          required
          >
          <option value=''>select Category</option>
          {categories?.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </form>
    </div>
  )
}

export default AddProducts