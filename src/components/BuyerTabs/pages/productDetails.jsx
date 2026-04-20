import React, { useState, useMemo } from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import { useParams } from 'react-router-dom';
import useProducts from '../../../Hooks/useProduts';
import { detail } from '../../../assets';
import { CiSquareChevLeft, CiSquareChevRight } from 'react-icons/ci';
import AttributeConfig from '../../../commons/Data/AttributConfig';
import { SiGithubsponsors } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { ReviewSection, Footer } from '../../';
import { Toaster } from 'react-hot-toast';
import ProductSkeleton from '../BuyerItems/productSkeleton';
import { MdRemoveShoppingCart, MdError } from "react-icons/md";
import ProductCard from '../BuyerItems/productCard';
import useCart from '../../../Hooks/useCart';

function ProductDetails() {
  const [activeTab, setActiveTab] = useState('Vendor');
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { slugId } = useParams();

  const { getProductBySlugId, getSimilarProducts } = useProducts();
  const { data, isLoading } = getProductBySlugId(slugId);
  const { addToCart } = useCart();

  const product = data?.product;
  //const count = data?.productCount;

  const { data: similarProducts = [], isLoading: similarLoading, isError: similarError } = getSimilarProducts(product?._id);


  //console.log('Product detail:', product);
  //console.log('Count for Vendor', count);

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

  const detailTabs = [
    { name: 'Vendor', link: '/vendor' },
    { name: 'Review', link: '/review' },
  ]

  //console.log("normalizedAttributes:", normalizedAttributes);
  //console.log("AttributeConfig:", AttributeConfig);
  //console.log(AttributeConfig);

  return (
    <Inner>
      <Toaster position='top-right' reverseOrder={false} />
      <section className='min-h-[30vh] flex flex-col justify-center items-center overflow-hidden'
        style={{
          backgroundImage: `url(${detail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
          <h1 className='font-semibold text-4xl text-dark leading-relaxed PathName'>
            {product?.name}
          </h1>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            {breadCrumbs.map((item, i) => (
              <span key={i} className='flex items-center gap-1'>
                {item.path ? (
                  <a 
                    href={item.path} 
                    className='hover:text-primary cursor-pointer path'>
                      {item.label}
                  </a>
                ) : (
                  <span className='text-gray-600 font-medium path'>
                    {item.label}
                  </span>
                )}

                {i < breadCrumbs.length - 1 && <span className='path'>/</span>}
              </span>
            ))}
          </div>
      </section>

      <section className='min-h-[30vh] px-[2%] overflow-hidden my-5'>
        <div className='grid grid-cols-2 gap-4 detFirstsec'>
          <div className='flex flex-col gap-3 py-2'>
            <div className='relative bg-gray-100 rounded-md overflow-hidden'>
              <img
                src={images[activeIndex]}
                alt={product?.name}
                className='w-full h-[400px] object-contain prodMainImg'
              />

              <CiSquareChevLeft
                onClick={prev}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-dark cursor-pointer detArrow' 
                size={30}
              />
              
              <CiSquareChevRight 
                onClick={next}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-dark cursor-pointer detArrow' 
                size={30}
              />
            </div>

            <div className='flex gap-3 mt-4 items-center justify-center'>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setActiveIndex(index)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition DetSuppImgs ${
                   activeIndex === index
                    ? 'border-primary scale-105'
                    : 'border-transparent opacity-70'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-2 py-6 px-3'>
            <h2 className='font-semibold leading-relaxed text-2xl text-dark detName'>
              {product?.name}
            </h2>

            <p className='text-base text-gray-600 mt-2 detDesc'>
              {product?.description}
            </p>

            <div className='flex items-center justify-end'>
              {product?.sponsored === true ? (
                <p className='text-xs text-gray-500 px-2 py-1 flex items-center gap-1'>
                  sponsored <SiGithubsponsors className='detSpon' size={10} />
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
                  <p className='text-xl font-semibold text-primary detPrice'>
                    Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.discountPrice / 100)}
                  </p>

                  <p className='text-xs font-medium text-gray-600 line-through'>
                    Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.price / 100)}
                  </p>                
                </>
              ) : (
                <p className='text-xl font-semibold text-primary detPrice'>
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
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className='px-3 py-1 border rounded text-base font-semibold cursor-pointer'>
                    -
                </button>

                <button
                  className='px-3 py-1 border rounded text-base font-semibold cursor-pointer'>
                    {quantity}
                </button>

                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className='px-3 py-1 border rounded text-base font-semibold cursor-pointer'>
                    +
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart.mutate({
                    productId: product._id,
                    vendorId: product.vendorId?._id,
                    vendorName: product.vendorId?.businessInfo?.legalName,
                    quantity: quantity,
                    price: product.price,
                    name: product.name,
                    image: product.MainIMg,
                    description: product.description,
                    discount: product.discount,
                    discountPrice: product.discountPrice,
                    productQuantity: product.quantity,
                  });
                }}
                className='rounded-full px-4 py-2 cursor-pointer bg-primary text-white'
              >
                Add to cart
              </button>

              <button
               className='rounded-full px-4 py-2 cursor-pointer bg-secondary text-dark'>
                Buy now
              </button>

              <span className='text-gray-700'>
               <SiGithubsponsors className='cursor-pointer detArrow' size={20} />
              </span>
            </div>

            <div className='flex gap-2 flex-wrap mt-2'>
              {productTags.map((tag, i) => (
                <span
                  key={i}
                  className='px-3 py-1 text-sm bg-gray-300 rounded-full text-gray-700 tags'
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='min-h-[30vh] px-[2%] overflow-hidden my-5'>
        <div className='flex justify-center items-center'>
          <ul className='list-none flex gap-2 items-center'>
            {detailTabs.map((item, index) => {
              const isActive = activeTab === item.name;

              return(
                <li 
                  key={index}>
                    <button 
                      id='DetailBtn'
                      onClick={() => setActiveTab(item.name)}
                      className={`px-2 py-1 rounded cursor-pointer ${
                      isActive ? 'underline decoration-primary decoration-2 text-primary font-semibold text-base underline-offset-4' : 'text-base text-gray-600'}`}>
                        {item.name}
                      </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className='my-4 p-[2%]'>
          <AnimatePresence mode='wait'>
            {activeTab === 'Vendor' && (
              <motion.div
                key='Vendor'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='flex items-center justify-center p-1'
                >
                  <div className='w-[60%] rounded-2xl overflow-hidden relative bg-gray-100 ProdVendor673'>
                    <div className='h-40 w-full relative ProdBanCon'>
                      <img
                        src={product.vendorId?.banner}
                        alt='banner'
                        className='w-full h-full object-cover'
                        loading='lazy'
                      />
                    </div>

                    <div className='relative px-8 pt-15'>
                      <div className='absolute -top-16 left-8'>
                        <div className='w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-md prodLogoCon'>
                          <img 
                            src={product.vendorId?.logo}
                            alt='logo'
                            loading='lazy'
                            className='w-full h-full object-cover'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='my-3 flex flex-col gap-2 px-4 prodDetVenCon'>
                      <div className='flex justify-between items-center'>
                          <h1 className='flex gap-2 items-center text-dark font-semibold text-2xl'>
                            {product.vendorId?.businessInfo?.legalName}
                             {product.vendorId?.verification?.isverified === true ? (
                              <RiVerifiedBadgeFill className='text-primary prodVenIco' size={23}/>
                             ) : ( 
                              <p className='text-xs text-transparent px-2 py-1'/>
                             )}
                          </h1>
                          <p className='text-sm text-gray-700'>
                            {product.vendorId?.store?.addresses?.country}
                          </p>
                      </div>

                      <p className='text-base text-gray-600 leading-relaxed tracking-normal'>
                        {product.vendorId?.store?.description}
                      </p>

                      <button
                        className='px-3 py-2 rounded-full bg-dark text-white text-base cursor-pointer hover:text-secondary'>
                          Visit Store
                        </button>
                    </div>
                  </div>
                </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode='wait'>
            {activeTab === 'Review' && (
              <motion.div
                key='Review'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                >
                  <ReviewSection product={product} />
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className='min-h-[30vh] px-[2%] overflow-hidden my-5 py-4 bg-gray-100'>
        <p className='text-center text-gray-600 text-sm my-2'>Related Products</p>
        <div className='flex items-center justify-center CatTexts001'>
          <h2 className='font-semibold text-2xl flex items-center gap-1 mb-4 text-dark pdosC'>
            <span className=''>
              Explore 
            </span>
            <span className='text-primary'>Related Products</span>
          </h2>
        </div>

        <div className='grid grid-cols-5 gap-3 simProd'>
  
          {similarLoading && (
            Array.from({ length: 5 }).map((_, i) => 
              <ProductSkeleton key={i} /> 
            )
          )}

          {similarError && (
            <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
              <MdError className='text-red-500' size={45} />
              <p className='text-red-500'>Failed to load related products</p>
            </div>
          )}

          {!similarLoading && !similarError && (
            similarProducts?.length > 0 ? (
              similarProducts.slice(0,5).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className='col-span-full text-center text-gray-500 flex flex-col items-center gap-2'>
                <MdRemoveShoppingCart className='text-red-500' size={45} />
                <p>No similar products found</p>
              </div>
            )
          )}
        </div>
      </section>

      <Footer />
    </Inner>
  );
}

export default ProductDetails