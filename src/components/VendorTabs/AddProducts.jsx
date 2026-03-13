import React from 'react';
import './vendorTabs.css';
import useProducts from '../../Hooks/useProduts';

function AddProducts() {
  const { createProduct } = useProducts();

  return (
    <div>AddProducts</div>
  )
}

export default AddProducts