import React, { useState, useMemo } from 'react';
import { Inner } from '../../../commons';
import { useParams } from 'react-router-dom';
import useProducts from '../../../Hooks/useProduts';
import { detail } from '../../../assets';
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import AttributeConfig from '../../../commons/Data/AttributConfig';
import { SiGithubsponsors } from "react-icons/si";
import { trim } from 'lodash';

function ProductDetails() {
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { slugId } = useParams();

  const { getProductBySlugId } = useProducts();
  const { data, isLoading } = getProductBySlugId(slugId);

  const product = data?.product;

  //console.log('Product detail:', product);

  const breadCrumbs = useMemo(() => {
    if (!product) return [];

    return [
      { label: 'Home', path: '/buyer/products' },
      { label: product.category.name, path: /*category/${product.category}*/  null },
      { label: product.brand, path: /*`/brand/${product.brand}`*/ null },
      { label: product.name, path: null },
    ];
  }, [product]);

  const images = useMemo(() => {
    if (!product) return [];
    return [product.MainIMg, ...(product.supportImgs || [])];
  }, [product]);

  const next = () => {
    setActiveIndex((prev) => 
    prev === images.length - 1 ? 0 : prev + 1
   );
  };

  const prev = () => {
    setActiveIndex((prev) => 
    prev === 0 ? images.length - 1 : prev - 1
   );
  };


  const colorMap = {
    black: "#000",
    white: "#fff",
    red: "#f00",
    blue: "#00f",
    green: "#0f0",
    yellow: "#ff0",
    gray: "#808080",
    grey: "#808080",
    pink: "#ffc0cb",
    purple: "#800080",
    orange: "#ffa500",
  };
  
  const normalizedAttributes = useMemo(() => {
    if (!product?.attributes) return {};
  
    return product.attributes.reduce((acc, attr) => {
      if (!attr?.name) return acc;
  
      let name = attr.name;
  
      if (Array.isArray(name)) {
        name = name[0];
      }
  
      if (typeof name === "object") {
        name = name?.en || "";
      }
  
      name = String(name).toLowerCase().trim();
  
      acc[name] = attr.value;
      return acc;
    }, {});
  }, [product]);

  const getValues = (value) => {
    if (!value) return [];
  
    if (Array.isArray(value)) return value;
  
    if (typeof value === "string") {
      return value.split(",").map(v => v.trim());
    }
  
    return [];
  };

  const renderAttribute = (key, value) => {
    const config = AttributeConfig?.[key];
    if (!config || !value) return null;

    const values = getValues(value);

    if (config.type === 'color') {
      return (
        <div
          key={key} 
          className='flex flex-wrap items-center gap-3 mt-4'>
            <span className='font-semibold text-base text-dark'>
              {config.label}:
            </span>

            {values.map((color, index) => {
              const normalized = color.toLowerCase();

              return (
                <div
                  key={index}
                  title={color}
                  onClick={() => setSelectedColor(normalized)}
                  className={`w-5 h-5 rounded-full cursor-pointer ${
                   selectedColor === normalized
                    ? 'ring-2 ring-black'
                    : ''
                  }`}
                  style={{
                    backgroundColor: colorMap[normalized] || normalized,
                  }}
                />
              );
            })}
          </div>
      );
    }

    return (
      <div
        key={key}
        className='flex items-center gap-2 mt-4'>
          <span className='font-semibold text-base text-dark'>
            {config.label}:
          </span>
          <span
            className='text-gary-600'>
              {values.join(',')}
          </span>
      </div>
    );
  };

  const productTags = Array.isArray(product?.tags)
   ? product.tags
   : (product?.tags || '').split(',').map(tag => tag.trim());

  if (isLoading) {
    return (
      <Inner>
        <div className="p-10 text-center">Loading...</div>
      </Inner>
    );
  } 

  //console.log("normalizedAttributes:", normalizedAttributes);
  //console.log("AttributeConfig:", AttributeConfig);
  //console.log(AttributeConfig);

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

      <section className='min-h-[30vh] px-[2%] overflow-hidden my-5'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-3 py-2'>
            <div className='relative bg-gray-100 rounded-md overflow-hidden'>
              <img
                src={images[activeIndex]}
                alt={product?.name}
                className='w-full h-[400px] object-contain'
              />

              <CiSquareChevLeft
                onClick={prev}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-dark cursor-pointer' 
                size={30}
              />
              
              <CiSquareChevRight 
                onClick={next}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-dark cursor-pointer' 
                size={30}
              />
            </div>

            <div className='flex gap-3 mt-4 items-center justify-center'>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setActiveIndex(index)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition ${
                   activeIndex === index
                    ? 'border-primary scale-105'
                    : 'border-transparent opacity-70'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-2 py-6 px-3'>
            <h2 className='font-semibold leading-relaxed text-2xl text-dark'>
              {product?.name}
            </h2>

            <p className='text-base text-gray-600 mt-2'>
              {product?.description}
            </p>

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

            <div className='flex items-center gap-2 DisCardText'>
              {product?.discount > 0 ? (
                <>
                  <p className='text-xl font-semibold text-primary'>
                    Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.discountPrice / 100)}
                  </p>

                  <p className='text-xs font-medium text-gray-600 line-through'>
                    Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.price / 100)}
                  </p>                
                </>
              ) : (
                <p className='text-xl font-semibold text-primary'>
                  Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.price / 100)}
                </p>
              )}
            </div>

            <div className='mt-4'>
              {Object.entries(normalizedAttributes).map(([key, value]) => {
                //console.log("key:", key, "value:", value, "config:", AttributeConfig[key]);
                return (
                  <React.Fragment key={key}>
                    {renderAttribute(key, value)}
                  </React.Fragment>
                );
              })}
            </div>

            <div className='flex flex-wrap items-center gap-2 my-3'>
              <div className='flex gap-1'>
                <button
                  className='px-3 py-1 border rounded text-base font-semibold cursor-pointer'>
                    -
                </button>

                <button
                  className='px-3 py-1 border rounded text-base font-semibold cursor-pointer'>
                    1
                </button>

                <button
                  className='px-3 py-1 border rounded text-base font-semibold cursor-pointer'>
                    +
                </button>
              </div>

              <button
               className='rounded-full px-4 py-2 cursor-pointer bg-primary text-white'>
                Add to cart
              </button>

              <button
               className='rounded-full px-4 py-2 cursor-pointer bg-secondary text-dark'>
                Buy now
              </button>

              <span className='text-gray-700'>
               <SiGithubsponsors className='cursor-pointer' size={20} />
              </span>
            </div>

            <div className="flex gap-2 flex-wrap mt-2">
              {productTags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-gray-300 rounded-full text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Inner>
  );
}

export default ProductDetails