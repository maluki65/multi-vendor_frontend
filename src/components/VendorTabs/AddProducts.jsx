import React, { useState, useRef, useEffect } from 'react';
import './vendorTabs.css';
import { AdLoader } from '..';
import { FaCameraRetro } from "react-icons/fa6";
import { toast, Toaster } from 'react-hot-toast';
import useProducts from '../../Hooks/useProduts';
import useCategory from '../../Hooks/useCategory';
import { useQueryClient } from '@tanstack/react-query';
import uploadProductImgs from '../../utils/productImgs';

const InitialFormStatus = {
  category: '',
  name: '',
  description: '',
  tags: [],
  price: '',
  quantity: '',
}

function AddProducts({ vendorId }) {
  const { createProduct } = useProducts();
  const { getActiveCategories, useCategoryAttributes, fetchCategoryAttributes } = useCategory();
  const { data: categories, isLoading: categoriesLoading } = getActiveCategories;
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState(InitialFormStatus);
  const [attributeValues, setAttributesValues] = useState({});
  const [images, setImages] = useState({
    mainImg: { file: null, preview: null, error: '', dragging: false },
    supportImg: { file: [], preview: [], error: '', dragging: false }
  });

  const {
    data: attributes = [],
    isLoading: attributesloading
  } = useCategoryAttributes(form.category)
  

  const [uploading, setUploading] = useState(false);

  const mainRef = useRef();
  const supportRef = useRef();

  useEffect(() => {
    return () => {
      if (images.mainImg.preview) {
        URL.revokeObjectURL(images.mainImg.preview);
      }

      images.supportImg.preview.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [images]);

  useEffect(() => {
    if (!form.category) return;

    queryClient.prefetchQuery({
      queryKey: ['categoryAttributes', form.category],
      queryFn: () => fetchCategoryAttributes(form.category),
    });
  }, [form.category])

  useEffect(() => {
    if (!attributes.length) return;

    const initialValue = {};
    attributes.forEach(attr => {
      initialValue[attr._id] = '';
    });

    setAttributesValues(initialValue);
  }, [attributes])

  /*useEffect(() => {
    console.log('Updated previews:', images.supportImg.preview);
  }, [images.supportImg.preview]);*/

  const MAX_IMG_SIZE = 5;

  const updateImageState = (key, updates) => {
    setImages(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target; 

    console.log('CHANGE:', name, value);  

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (key, files) => {
    if (!files || files.length === 0 ) return;

    if (key === 'mainImg') {
      const file = files[0];

      if (file.size > MAX_IMG_SIZE * 1024 * 1024) {
        return updateImageState(key, { error: `Image exceeds ${MAX_IMG_SIZE}MB limit`});
      }

      const preview = URL.createObjectURL(file);

      updateImageState(key, {
        file,
        preview,
        error: ''
      });
    } else {
      const newFiles = Array.from(files);

      const validFiles = newFiles.filter(
        (file) => file.size <= MAX_IMG_SIZE * 1024 * 1024
      );

      const previews = validFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => ({
        ...prev,
        supportImg: {
          ...prev.supportImg,
          file: [ ...prev.supportImg.file, ...validFiles],
          preview: [...prev.supportImg.preview, ...previews],
          error: ''
        }
      }));
      
    }
  };

  const handleFileChange = (key, e) => {
    const files =  e.target.files;
    handleImageChange(key, files);
  }

  const handleDragOver = (key, e) => {
    e.preventDefault();
    updateImageState(key, { dragging: true });
  };

  const handleDragLeave = (key) => {
    updateImageState(key, { dragging: false });
  };

  const handleDrop = (key, e) => {
    e.preventDefault();
    updateImageState(key, { dragging: true });

    const files = e.dataTransfer.files;

    if (files && files.length > 0 && files[0].type.startsWith('image/')) {
      handleImageChange(key, files);
    }
  };

  const handleDiscard = (key, index = null) => {
    if (key === 'mainImg') {
      if (images.mainImg.preview) {
        URL.revokeObjectURL(images.mainImg.preview);
      }
  
      updateImageState('mainImg', {
        file: null,
        preview: null,
        error: '',
        dragging: false,
      });
    } else {
      const files = [...images.supportImg.file];
      const previews = [...images.supportImg.preview];

      URL.revokeObjectURL(previews[index]);

      files.splice(index, 1);
      previews.splice(index, 1);

      updateImageState('supportImg', {
        file: files,
        preview: previews
      });
    }
  };

  const handleTags = (e) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim());

    setForm((prev) => ({
      ...prev,
      tags: tagsArray
    }));
  };

  console.log('category:', form.category);
  console.log('attributes:', attributes);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!images.mainImg.file){
      toast.error('Main product image is required');
      return;
    }

    if(images.supportImg.file.length > 6 ){
      toast.error('Only six images are allowed for supporting images');
      return;
    }

    const formattedAttributes = attributes.map(attr => ({
      attributeId: attr._id,
      name: attr.name,
      value: attributeValues[attr._id]
    }));

    try{
      setUploading(true);

      const mainUpload = await uploadProductImgs(images.mainImg.file, vendorId);
      let supportUpload = [];

      if (images.supportImg.file.length > 0) {
        supportUpload = await uploadProductImgs(images.supportImg.file, vendorId);
      }

      /*if (isError) {
        toast.error('Cannot submit product. Failed to load attributes.');
        return;
      }*/

      const payload = {
        ...form,
        attributes: formattedAttributes,

        MainIMg: mainUpload[0].url,
        MainIMgId: mainUpload[0].fileId,

        supportImgs: supportUpload.map(img => img.url),
        supportImgsId: supportUpload.map(img => img.fileId)
      };

      createProduct.mutate(payload);

      setForm(InitialFormStatus);
      setImages({
        mainImg: { file: null, preview: null, error: '', dragging: false },
        supportImg: { file: [], preview: [], error: '', dragging: false }
      })

      toast.success('product submitted for moderation');
    } catch (error) {
      console.error('Error creating product...', error);
      toast.error('Error creating product');
    } finally {
      setUploading(false);
    }
  }

  if(categoriesLoading) return <div>Loading categories...</div>;

  return (
    <>
      <Toaster position='top-right' reverseOrder={false}/>
      {uploading ?  (
        <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
          <AdLoader/>
        </div>
      ) : (
        <div className='bg-white rounded-xl mt-4 p-4'>
          <h2 className=''>Add Products</h2>
          <p className='flex items-center gap-1 text-sm my-2'>All fields marked with <span className='text-red-600'>*</span> are required!</p>
          <p className='flex items-center gap-1 text-sm my-2 text-red-400'>When uploading product images, please ensure that all images have a white background and are centered for review.
          </p>

          <form onSubmit={handleSubmit} className='flex flex-col my-3 space-y-4'>
            
            <div className='flex flex-col gap-1'>
              <label className='flex items-center text-sm gap-1'>Product name <span className='text-red-600'>*</span></label>
              <input 
                type='text'
                name='name'
                placeholder='Samsung S26 Ultra'
                value={form.name}
                onChange={handleChange}
                required
                className='p-2 outline-none w-[60%] focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
              />
            </div>

            <div className='flex flex-col rounded-md bg-primary p-3 space-y-2'>
              <div className='grid grid-cols-3 gap-2 items-center'>
                <div className='flex flex-col gap-1'>
                  <label className='flex items-center text-sm text-white gap-1'>Tags <span className='text-white'>*</span></label>
                  <input 
                    type='text'
                    name='tags'
                    placeholder='Tags(comma separated) android, samsung'
                    value={form.tags.join(',')}
                    onChange={handleTags}
                    required
                    className='p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label className='flex items-center text-sm text-white gap-1'>Product Price <span className='text-white'>*</span></label>
                  <input 
                    type='number'
                    name='price'
                    placeholder='96,000'
                    value={form.price}
                    onChange={handleChange}
                    required
                    className='p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-400 rounded-lg bg-[#ebe7e7]'
                  />
                </div>              
                <div className='flex flex-col gap-1'>
                  <label className='flex items-center text-sm text-white gap-1'>Quantity <span className='text-white'>*</span></label>
                  <input 
                    type='number'
                    name='quantity'
                    placeholder='100'
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    className='p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
                  />
                </div>
              </div>
              <div className=''>
                <div className='flex flex-col gap-1'>
                  <label className='flex items-center text-sm text-white gap-1'>Category <span className='text-white'>*</span></label>
                  <select
                    name='category'
                    value={form.category}
                    onChange={handleChange}
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
                {attributes.length > 0 && (
                  <div className='grid grid-cols-3 gap-3 my-3 items-center'>
                    {attributes.map(attr => (
                      <div key={attr._id} className='flex flex-col'>
                        <label className='text-sm text-white'>
                          {attr.name} {attr.required && '*'}
                        </label>

                        {attr.type === 'select' ? (
                          <select
                            value= {attributeValues[attr._id] || ''}
                            onChange={(e) => 
                              setAttributesValues(prev => ({
                              ...prev,
                              [attr._id]: e.target.value
                              }))
                            }
                            className='p-2 outline-nonefocus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
                          >
                            <option value=''>Select {attr.name}</option>
                            {(attr.options || []).map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={attr.type === 'number' ? 'number' : 'text'}
                            value={attributeValues[attr._id] || ''}
                            onChange={(e) => 
                              setAttributesValues(prev => ({
                                ...prev,
                                [attr._id]: e.target.value
                              }))
                            }
                            className='p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              placeholder='Product description'
              required
              className='my-3 p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
              rows={5}
            />

            <div className='flex flex-col my-3 gap-1'>
              <label className='flex items-center gap-1 text-sm'>Main product img <span className='text-red-600'>*</span></label>
              <div 
                onDrop={(e) => handleDrop('mainImg', e)}
                onDragOver={(e) => handleDragOver('mainImg', e)}
                onDragLeave={(e) => handleDragLeave('mainImg', e)}
                className={`relative flex flex-col items-center justify-center max-w-64 h-50 bg-[#ebe7e7] border border-dashed rounded cursor-pointer transition-all duration-200 
                ${
                  images.mainImg.dragging 
                    ? 'border-blue-400 bg-[#ebe7e7] scale-105'
                    : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
                    }`
                  }
                  onClick={() => mainRef.current.click()}
                  >
                    {images.mainImg.preview ? (
                      <>
                        <img
                          src={images.mainImg.preview}
                          alt='Product main img'
                          className='w-full h-full object-cover rounded shadow-md'
                          loading='lazy'
                        />
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDiscard('mainImg');
                          }}
                          className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full p-1 flex items-center justify-center cursor-pointer'
                          >
                            X
                        </button>
                      </>
                    ) : (
                      <div className='flex flex-col items-center justify-center w-full h-full cursor-pointer'>
                        <FaCameraRetro className='text-gray-400' size={25}/>
                        <p className='text-xs text-gray-500 mt-1 flex items-center'>
                          Upload main img <span className='text-red-600'>*</span>
                        </p>
                        {images.mainImg.error && <p className='text-red-500 text-sm mt-1'>
                          {images.mainImg.error}
                        </p>}
                      </div>
                    )}
                    <input
                      type='file'
                      required
                      accept='image/*'
                      ref={mainRef}
                      onChange={(e) => handleFileChange('mainImg', e)}
                      className='hidden'
                    />
              </div>
            </div>

            <div className='flex flex-col gap-3 my-6'>
              <div className='flex flex-col gap-1'>
              <label className='flex items-center gap-1 text-sm'>supporting product img(s) <span className='text-red-600'>*</span></label>
              <label className='flex items-center gap-1 text-sm'>upload upto 6 images</label>
              {images.supportImg.error && <p className='text-sm my-3 text-red-600'>
                {images.supportImg.error}
              </p>}
              </div>
              <div 
                onDrop={(e) => handleDrop('supportImg', e)}
                onDragOver={(e) => handleDragOver('supportImg', e)}
                onDragLeave={(e) => handleDragLeave('supportImg', e)}
                className={`flex flex-col items-center justify-center max-w-full h-50 bg-[#ebe7e7] border border-dashed rounded transition-all duration-200 
                ${
                  images.supportImg.dragging 
                    ? 'border-blue-400 bg-[#ebe7e7] scale-105'
                    : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
                    }`
                  }
                //onClick={() => supportRef.current.click()}
                  >
                  <label 
                    htmlFor='supportImg'
                    className='flex flex-col items-center cursor-pointer justify-center w-full h-full'
                    >
                      <FaCameraRetro className='text-gray-400' size={25}/>
                      <p className='text-xs text-gray-500 mt-1 flex items-center'>
                        Upload supporting img(s) <span className='text-red-600'>*</span>
                      </p>
                    </label>
                    <input
                      id='supportImg'
                      type='file'
                      required
                      multiple
                      accept='image/*'
                      ref={supportRef}
                      onChange={(e) => handleFileChange('supportImg', e)}
                      className='hidden'
                    />
              </div>
              <div className='flex flex-wrap gap-2'>
                {images.supportImg.preview.map((src, i) => (
                  <div key={i} className='relative'>
                    <img 
                      src={src}
                      alt={`Supporting img ${i}`}
                      className='w-24 h-24 object-cover rounded'
                    />
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDiscard('supportImg', i);
                      }}
                      className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full p-1 flex items-center justify-center cursor-pointer'
                      >
                        X
                    </button>
                  </div>                
                ))}
              </div>
            </div>

            <button 
            type="submit" 
            disabled={uploading}
            className='bg-primary cursor-pointer text-white rounded px-3 py-2'
            >
              {uploading ? 'Uploading...' : 'Submit Product'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default AddProducts