import React from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import useProducts from '../../../Hooks/useProduts';
import ProductSkeleton from '../BuyerItems/productSkeleton';

function Products() {
  const itemsPerPage = 15;
  const { getAllProducts } = useProducts();
  const { data, isLoading, isError } = getAllProducts({
    page: 1,
    limit: 50
  });

  return (
    <Inner>
      <div className='bg-red-200 h-screen'>Products</div>
    </Inner>
  )
}

export default Products