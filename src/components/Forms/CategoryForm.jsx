import React, { useState } from 'react';
import './forms.css';
import useCategory from '../../Hooks/useCategory';
import { TbCategoryFilled } from "react-icons/tb";

const InitialStateForm = {
  name:'',
  commissionRate: '',
  parent: '',
  attributes: [],
};

const InitialAttribute = {
  name: '',
  type: 'text',
  options: '',
};

function CategoryForm() {
  const { addCategory, getAllCategories } = useCategory();
  const categories = getAllCategories?.data || [];

  const [form, setForm] = useState(InitialStateForm);
  const [attribute, setAttribute] =  useState(InitialAttribute);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, [name]: value 
    }));
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setAttribute((prev) => ({ ...prev, [name]: value }));
  };

  const addAttribute = () => {
    if (!attribute.name) return;

    const newAttribute = {
      name: attribute.name,
      type: attribute.type,
      options:
       attribute.type === 'select'
        ? attribute.options.split(',').map((o) => o.trim())
        : [],
    };

    setForm((prev) => ({
      ...prev,
      attributes: [...prev.attributes, newAttribute],
    }));

    setAttribute(InitialAttribute);
  };

  const removeAttribute = (index) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCategory.mutate({
      name: form.name,
      commissionRate: form.commissionRate,
      parent: form.parent || null,
      attribute: form.attributes,
    });
    setForm(InitialStateForm)
  };
  
  return (
    <form className='p-4 space-y-2 flex flex-col category-form' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-2 mb-4'>
        <h2 className='flex items-center gap-2 text-dark text-xl'>
          <TbCategoryFilled className='text-secondary' size={25} />
          Add Category 
        </h2>
        <p className='text-dark'>
          All fields marked with 
          <span className='text-red-600'>*</span> 
          are required
        </p>
      </div>

      <div className='grid grid-cols-3 gap-3'>
        <div className='flex flex-col gap-1'>
          <label className='text-dark flex items-center gap-2'>Category Name <span className='text-red-600'>*</span></label>
          <input
            type='text'
            name='name'
            value={form.name}
            onChange={handleChange}
            required
            className='p-2 outline-dark focus:outline-secondary focus:border-[1.5px] rounded-lg border'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-dark flex items-center gap-2'>Commission Rate <span className='text-red-600'>*</span></label>
          <input
            type='number'
            name='commissionRate'
            value={form.commissionRate}
            onChange={handleChange}
            required
            min='0'
            max='100'
            className='p-2 outline-dark focus:outline-secondary focus:border-[1.5px] rounded-lg border'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-dark flex items-center gap-2'>Parent Category<span className='text-red-600'>*</span></label>
          <select  
           name="parent" 
           value={form.parent} 
           onChange={handleChange}
           className='p-2 outline-dark focus:outline-secondary focus:border-[1.5px] rounded-lg border'>
            <option value="">None</option>
            {categories.map((cat) => (
             <option key={cat._id} value={cat._id}>
               {cat.name}
             </option>
            ))}
          </select>
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <h2 className='text-dark flex items-center gap-2'>Attributes<span className='text-red-600'>*</span></h2>
        <div className='grid grid-cols-4 gap-2'>
          <input
            type='text'
            name='name'
            placeholder='Attribute name'
            value={attribute.name}
            onChange={handleAttributeChange}
            className='p-2 outline-dark focus:outline-secondary focus:border-[1.5px] rounded-lg border'
          />

          <select
            name='type'
            value={attribute.type}
            onChange={handleAttributeChange}
            className='p-2 outline-dark focus:outline-secondary focus:border-[1.5px] rounded-lg border'
              >
                <option value='text'>Text</option>
                <option value='number'>Number</option>
                <option value='boolean'>Boolean</option>
                <option value='select'>Select</option>
          </select>

          {attribute.type === 'select' && (
            <input
              type='text'
              name='options'
              placeholder='Comma separated options'
              value={attribute.options}
              onChange={handleAttributeChange}
              className='p-2 outline-dark focus:outline-secondary focus:border-[1.5px] rounded-lg border'
            />
          )}

          <button 
            type='button'
            onClick={addAttribute}
            className='text-white bg-primary px-2 py-3 rounded-xl cursor-pointer'>
              Add attribute
          </button>

          {form.attributes.map((attr, index) => (
            <div 
              key={index}
              className=''
               >
                <span className='flex items-center gap-2 text-dark'>
                  {attr.name} ({attr.type})
                </span>
                <button
                  type='button'
                  onClick={() => removeAttribute(index)}
                  className='text-sm cursor-pointer bg-red-500 rounded-md text-white px-2 py-1'>
                    Remove
                </button>
            </div>
          ))}
        </div>
      </div>

      <button 
        type='submit'
        disabled={addCategory.isPending}
        className='my-3 rounded-full bg-primary text-white cursor-pointer py-2 px-3'
         >
          {addCategory.isPending ? 'Creating...' : 'Create category'}
      </button>
    </form>  
  );
}

export default CategoryForm