import React, { useState, useEffect } from 'react';
import './vendorTabs.css';
import { AdLoader } from '..';
import useCategory from '../../Hooks/useCategory';
import uploadProductImgs from '../../utils/productImgs'; 

function EditProductForm({ product, onClose, onUpdate }) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || '');
  const [quantity, setQuantity] = useState(product?.quantity || '');
  const [tags, setTags] = useState(Array.isArray(product?.tags) ? product.tags.join(', ') : '');
  const [attributeValues, setAttributesValues] = useState({});
  const [category, setCategory] = useState(product?.category?._id || '');
  

  const [mainImgFile, setMainImgFile] = useState(null);
  const [mainImgPreview, setMainImgPreview] = useState(product?.MainIMg || '');
  const [supportFiles, setSupportFiles] = useState([]);
  const [supportPreviews, setSupportPreviews] = useState(product?.supportImgs || []);

  const [isUploading, setIsUploading] = useState(false);
  const { getActiveCategories, useCategoryAttributes, fetchCategoryAttributes } = useCategory();
  const { data: categories } = getActiveCategories;
  const {
    data: attributes = [],
    isLoading: attributesloading
  } = useCategoryAttributes(category)

  useEffect(() => {
    if (mainImgFile) {
      const reader = new FileReader();
      reader.onloadend = () => setMainImgPreview(reader.result);
      reader.readAsDataURL(mainImgFile);
    }
  }, [mainImgFile]);

  useEffect(() => {
    if(category) {
      setAttributesValues({});
      fetchCategoryAttributes(category);
    }
  }, [category]);

  useEffect(() => {
    if (supportFiles.length > 0) {
      const previews = supportFiles.map(file => URL.createObjectURL(file));
      setSupportPreviews(previews);
    }
  }, [supportFiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let mainImgData = {};
      let supportImgsData = [];

      if (mainImgFile) {
        const uploadedMain = await uploadProductImgs(mainImgFile, product.vendorId);
        mainImgData = { MainIMg: uploadedMain[0].url, MainIMgId: uploadedMain[0].fileId };
      }

      if (supportFiles.length > 0) {
        const uploadedSupport = await uploadProductImgs(supportFiles, product.vendorId);
        supportImgsData = {
          supportImgs: uploadedSupport.map(i => i.url),
          supportImgsId: uploadedSupport.map(i => i.fileId),
        };
      }

      const payload = {
        name,
        description,
        price,
        category,
        quantity,
        tags: tags.split(',').map(t => t.trim()),
        ...mainImgData,
        ...supportImgsData,
      };

      //console.log('category Id:', payload.category)

      await onUpdate(product._id, payload); 
      //toast.success('Product updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to update product', error);
      //toast.error('Failed to update product. Try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    isUploading ? (
      <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
        <AdLoader/>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className='flex flex-col gap-1'>
          <label className='text-sm'>Product name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Product Name"
            required
            className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm'>Description:</label>
            <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            required
            className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm'>Price:</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price"
            required
            className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm'>Category:</label>
          <select
            name='category'
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            className='p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
          >
            <option value=''>Select Category</option>
            {categories?.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm'>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            placeholder="Quantity"
            required
            className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm'>Tags:</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className='p-2 outline-none focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Main Image:</label>
          {mainImgPreview && (
            <img src={mainImgPreview} alt="Main Preview" className="h-40 w-40 object-cover rounded editImg" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={e => setMainImgFile(e.target.files[0])}
            className='bg-primary text-white rounded cursor-pointer w-fit px-1'
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Gallery Images:</label>
          <div className="flex gap-2 flex-wrap">
            {supportPreviews.map((src, idx) => (
              <img key={idx} src={src} alt={`Support ${idx}`} className="h-24 w-24 object-cover rounded editImg" />
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const allFiles = Array.from(e.target.files);

              if (allFiles.length > 6){
                alert ('you can upload maximum of 6 images')
              }

              const files = allFiles.slice(0, 6);
              setSupportFiles(files);

              e.target.value = null;
            }}
            className='bg-primary text-white rounded cursor-pointer w-fit px-1'
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
        >
          {isUploading ? 'Updating...' : 'Update Product'}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-200 cursor-pointer"
        >
          Cancel
        </button>
      </form>
    )
  );
}

export default EditProductForm;