import React, { useState, useMemo, useRef } from 'react';
import './Tabs.css';
import useCategory from '../../Hooks/useCategory';
import { CategoryForm, ActionPopUp, Table, VerifyDoc, EditCategoryModals } from '..';

function Category() {
  const { getAllCategories, toggleStatusMutation } = useCategory();
  const categories = getAllCategories?.data || [];

  const [selectedEditCategory, setSelectedEditCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [modalOpen, setModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  const pages = categories?.pages || 1;

  const columns = [
    { label: 'Name', 
      field: 'name' 
    },

    {
      label: 'Commission Rate(%)',
      field: 'commissionRate'
    },

    {
      label: 'Parent',
      field: 'parent',
      render: (row) => row.parent?.name || 'None'
    },

    {
      label: 'Status',
      field: 'isActive',
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs rounded-full text-white catStatus ${row.isActive ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const handleToggleStatus = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedEditCategory(category);
    setEditModalOpen(true);
  };

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [categories, sortField, sortOrder]);

  if (showForm) {
    return (
      <div>
        <CategoryForm />
        {categories.length > 0 && (
          <button 
            onClick={() => setShowForm(false)}
            className='mt-4 bg-gray-600 text-white px-3 py rounded cursor-pointer'>
              Back to categories
          </button>
        )}
      </div>
    );
  }
  return (
    <div className='p-4 space-y-4'>
      <div className='flex justify-between items-center sm:flex flex-wrap my-4'>
        <h2 className='text-xl font-semibold'>Categories</h2>
        <button
          onClick={() => setShowForm(true)}
          className='bg-primary text-white px-2 py-1 cursor-pointer rounded addCat'>
            + Add Category
          </button>
      </div>

      <Table
        columns={columns}
        data={sortedCategories}
        loading={!categories.length} 
        sortField={sortField} 
        sortOrder={sortOrder}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        renderActions={(row) => (
          <ActionPopUp
            row={row}
            onEdit={handleEditCategory}
            //onUpdate={() => console.log('Disable')}
            onToggleStatus={handleToggleStatus}
          />
        )}
      />

      <div className='flex justify-between items-center CatNav mt-4'>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
          >
            Prev
        </button>

        <span className=''>
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
          >
            Next
        </button>

        <VerifyDoc
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Change Status: ${selectedCategory?.name}`}
          >
            <p className='mb-4'>
              Are you sure you want to {selectedCategory?.isActive ? 'deactivate' : 'activate'} this category?
            </p>

            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setModalOpen(false)}
                className='px-2 py-1 border cursor-pointer rounded bg-gray-300 text-dark'>
                  Cancel
              </button>

              <button
                onClick={() => {
                  toggleStatusMutation.mutate(selectedCategory, {
                    onSuccess: () => setModalOpen(false)
                  })
                }}
                className='px-2 py-1 bg-red-500 text-white border cursor-pointer rounded'>
                  {selectedCategory?.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
        </VerifyDoc>

        <EditCategoryModals
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          category={selectedEditCategory}
          allCategories={categories}
        />     
      </div>
    </div>
  );
}

export default Category