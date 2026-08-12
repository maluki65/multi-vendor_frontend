import React from 'react'
import './../BuyerTabs.css';
import { useParams } from 'react-router-dom';
import { Inner } from '../../../commons';
import { AdLoader } from '../../';
import useProducts from '../../../Hooks/useProduts';
import { MdError, MdRemoveShoppingCart } from 'react-icons/md';
import { RiVerifiedBadgeFill } from 'react-icons/ri';

function StoreInfo() {
  const { storeSlug } = useParams();

  const { getStore } = useProducts();

  const { data, isLoading, isError } = getStore(storeSlug);
  const vendor = data?.vendor;
  const products = data?.products || [];

  console.log('Vendor', vendor);
  console.log('Products', products);
  return (
    <Inner>
      <div>vendorInfo</div>
    </Inner>
  )
}

export default StoreInfo