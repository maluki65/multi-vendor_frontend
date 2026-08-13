import React from 'react'
import './../BuyerTabs.css';
import { useParams } from 'react-router-dom';
import { Inner } from '../../../commons';
import { cartB8 } from '../../../assets';
import { AdLoader, Footer } from '../../';
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
      <section className='min-h-[35vh] w-full relative bg-gray-100'
        style={{
          backgroundImage: `url(${vendor?.banner || cartB8 })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className='absolute bottom-5 right-8 z-10'>
            <div className='w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-md bg-white'>
              <img
                src={vendor?.logo}
                alt={vendor?.businessInfo?.legalName}
                loading='lazy'
                className='w-full h-full object-cover'
              />
            </div>
          </div>          
      </section>

      <section className='px-[2%] my-5 overflow-hidden min-h-[30vh]'>
        <div className='grid grid-cols-[35%_65%] gap-2 items-center'>
          <h1 className='px-3 py-2 rounded-full border-[1.4px] font-semibold border-dark w-fit m-3 hover:bg-gray-200 hover:text-primary hover:border-orange-400 flex items-center gap-2'>
            About {vendor?.businessInfo?.legalName}
            <span className=''>
              {vendor?.verification?.isverified === true ? (
                <RiVerifiedBadgeFill className='text-primary' size={23} />
              ) : (
                <p className=''/>
              )}
            </span>
          </h1>
          <p className='text-right px-4 font-medium text-dark tracking-wide'>
           Fascism is a far-right, authoritarian, and ultranationalist political ideology. It features a dictatorial leader, strict societal control, and the violent crushing of any opposition. The state or race comes before individual rights.
          </p> {/*{vendor?.store?.description}*/}
        </div>
      </section>
    </Inner>
  )
}

export default StoreInfo