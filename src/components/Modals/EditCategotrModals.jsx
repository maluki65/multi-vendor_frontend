import React, { useState, useEffect } from 'react';
import './VerifyDoc.css';
import useCategory from '../../Hooks/useCategory';
import toast from 'react-hot-toast';

const EditCategoryModals = ({ isOpen, onClose, category, allCategories }) => {
  const { updateCategory } = useCategory();
  const [formData, setFormData] = useState({
    name: '',
    commissionRate: 0,
    parent: null,
    attributes: []
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        commissionRate: (category.commissionRate || 0) * 100,
        parent: category.parent?._id || null,
        attributes: category.attributes || []
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!category) return;

    updateCategory.mutate({
      id: category._id,
      updateData: {
        name: formData.name,
        commissionRate: formData.commissionRate,
        parent: formData.parent || null,
        attributes: formData.attributes
      }
    });

    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center backdrop-blur-sm items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 popCon shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Edit Category: {category?.name}</h3>

        <div className="flex flex-col gap-3">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded mt-1"
            />
          </label>

          <label>
            Commission Rate (%)
            <input
              type="number"
              name="commissionRate"
              value={formData.commissionRate}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded mt-1"
            />
          </label>

          <label>
            Parent Category
            <select
              name="parent"
              value={formData.parent || ''}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded mt-1"
            >
              <option value="">None</option>
              {allCategories
                .filter(cat => cat._id !== category._id)
                .map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </label>

          <label>
            Attributes (comma-separated)
            <input
              type="text"
              name="attributes"
              value={formData.attributes.join(', ')}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  attributes: e.target.value.split(',').map(a => a.trim())
                }))
              }
              className="w-full border px-2 py-1 rounded mt-1"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-primary text-white rounded cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModals