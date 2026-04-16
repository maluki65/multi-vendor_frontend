import React, { useState, useMemo, useEffect } from 'react';
import './HomeSwiperItems.css';
import { SiGithubsponsors } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Api } from '../../../utils';
import useCart from '../../../Hooks/useCart';

function ProductCard({ product }) {
  const [loaded, setLoaded] = useState(false);
  const queryClient = useQueryClient();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  /*useEffect(() => {
    if (product) {
      const correctSlug = `${product.slug}-${product._id}`;

      if (slugId !== correctSlug){
        navigate(`/product/${correctSlug}`, { replace: true });
      }
    }
  }, [product, slugId]);*/

  const prefetchProduct = () => {
    if (!product?._id || !product?.slug) return;

    const slugId = `${product.slug}-${product._id}`;

    queryClient.prefetchQuery({
      queryKey: ['product', slugId],
      queryFn: () =>
        Api.get(`/product/slug/${slugId}`).then(res => res.data),
      staleTime: 1000 * 60 * 5,
    });
  };
  
  const handleClick = () => {
    if (!product?._id || !product?.slug) return;

    navigate(`/buyer/products/${product.slug}-${product._id}`);
  }

  const shortDescription = useMemo(() => {
    return product?.description?.length > 20
      ? product.description.slice(0, 20) + '...'
      : product?.description;
  }, [product?.description]);

  const handleCart = (e) => {
    e.stopPropagation();

    addToCart.mutate({
      productId: product._id,
      quantity: 1,
      name: product.name,
      price: product.price,
      image: product.MainIMg,
      vendorId: product.vendorId
    });
  }

  return (
    <div 
      onMouseEnter={prefetchProduct}
      onClick={handleClick}
      className='rounded-md bg-white flex flex-col space-y-2 shadow-lg overflow-hidden py-2 cursor-pointer hover:border hover:border-primary'>
      
      <div className='h-[150px] relative overflow-hidden prodCon009'>

        <img
          src={product?.MainIMg}
          alt=''
          className={`absolute inset-0 w-full h-full object-cover scale-110 blur-md transition-opacity duration-500 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <img
          src={product?.MainIMg}
          alt={product?.name}
          onLoad={() => setLoaded(true)}
          className={` relative w-full h-full object-contain transition-all duration-700 ProdCarImg ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />

        {(product?.discount > 0 || product?.discount === null) && (
          <p className='absolute right-1.5 top-1 bg-transparent text-orange-500 text-base'>-{product?.discount}%</p>
        )}
      </div>

      <div className='flex items-center justify-end'>
        {product?.sponsored === true ? (
          <p className='text-xs text-gray-500 px-2 py-1 flex items-center gap-1'>
            sponsored <SiGithubsponsors size={10} />
          </p>
        ) : (
          <p className='text-xs text-transparent px-2 py-1'>
            not sponsored
          </p>
        )}
      </div>

      <div className='p-2 flex flex-col'>
        <h2 className='font-medium leading-relaxed line-clamp-2 wrap-break-words text-dark prodName'>
          {product?.name}
        </h2>

        <p className='text-sm line-clamp-2'>{shortDescription}</p>

        <div className='flex flex-col'>
          <div className='flex items-center justify-between gap-2 DisCardText'>
            {product?.discount > 0 ? (
              <>
                <p className='text-base font-semibold text-secondary'>
                  Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.discountPrice / 100)}
                </p>

                <p className='text-xs font-medium text-red-500 line-through'>
                  Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.price / 100)}
                </p>                
              </>
            ) : (
              <p className='text-md font-semibold text-secondary'>
                Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.price / 100)}
              </p>
            )}
          </div>
          <button 
            onClick={handleCart}
            className='px-2 py-1 bg-primary rounded-full text-sm text-gray-100 cursor-pointer'>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;