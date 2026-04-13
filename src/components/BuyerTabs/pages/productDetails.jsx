import React, { useMemo } from 'react';
import { Inner } from '../../../commons';
import { useParams } from 'react-router-dom';
import useProducts from '../../../Hooks/useProduts';
import { detail } from '../../../assets';

function ProductDetails() {

  const { slugId } = useParams();

  const { getProductBySlugId } = useProducts();
  const { data, isLoading } = getProductBySlugId(slugId);

  const product = data?.product;

  const breadCrumbs = useMemo(() => {
    if (!product) return [];

    return [
      { label: 'Home', path: '/buyer/products' },
      { label: product.category.name, path: /*category/${product.category}*/  null },
      { label: product.brand, path: /*`/brand/${product.brand}`*/ null },
      { label: product.name, path: null },
    ];
  }, [product]);

  console.log('Product detail:', product);
  return (
    <Inner>
      <section className='min-h-[30vh] flex flex-col justify-center items-center overflow-hidden'
        style={{
          backgroundImage: `url(${detail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
          <h1 className='font-semibold text-4xl text-dark leading-relaxed'>
            {product?.name}
          </h1>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            {breadCrumbs.map((item, i) => (
              <span key={i} className='flex items-center gap-1'>
                {item.path ? (
                  <a 
                    href={item.path} 
                    className='hover:text-primary cursor-pointer'>
                      {item.label}
                  </a>
                ) : (
                  <span className='text-gray-600 font-medium'>
                    {item.label}
                  </span>
                )}

                {i < breadCrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
        </section>
    </Inner>
  )
}

export default ProductDetails