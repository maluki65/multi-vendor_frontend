import React, { useState, useEffect, useMemo } from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import useProducts from '../../../Hooks/useProduts';
import { useSearchParams } from 'react-router-dom';
import ProductSkeleton from '../BuyerItems/productSkeleton';
import { FaChevronDown } from "react-icons/fa6";
import { IoGrid } from "react-icons/io5";
import { AiOutlineBars } from "react-icons/ai";
import { BuyerSideBar, Footer } from '../../';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../BuyerItems/productCard';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdRemoveShoppingCart, MdError } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";
import { ReactLenis } from 'lenis/react';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedProductBrand, setSelectedProductBrand] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000 * 100]);
  const [initialized, setInitialized] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [brandSearch, setBrandSearch] = useState('');
  const [sortOpen, setSortOpen] = useState(false);

  const limit = 48; //48


  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  const { getAllProducts, getFeaturedProducts, getProductFilters } = useProducts();
  const { data: featuredData, isLoading: featureLoading, isError: featureError } = getFeaturedProducts(8);

  const featuredProducts = featuredData?.products || [];

  const filters = useMemo(() => {
    const f = {
      page,
      limit,
    };

    if (search) f.search = search;

    if (selectedProductBrand.length > 0)
      f.brand = selectedProductBrand.join(',');

    if (selectedCategories.length > 0)
      f.category = selectedCategories.join(',');

    if (priceRange[0] > 0) f.minPrice = priceRange[0];
    if (priceRange[1] < 1000000) f.maxPrice = priceRange[1];

    if (sortOrder) f.sort = sortOrder;

    return f;
  }, [page, search, selectedProductBrand, selectedCategories, priceRange, brandSearch, sortOrder]);

  const { data, isLoading, isError } = getAllProducts(filters);
  const { data: filterData } = getProductFilters(filters);  
  const serverPriceRange = filterData?.priceRange;

  //console.log('Featured', featuredProducts);

  useEffect(() => {
    if (!initialized && serverPriceRange) {
      setPriceRange([
        serverPriceRange.min,
        serverPriceRange.max
      ]);
  
      setInitialized(true);
    }
  }, [serverPriceRange, initialized]);

  useEffect(() => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('sort', sortOrder);
      params.set('page', 1);
      return params;
    });
  }, [sortOrder]);

  useEffect(() => {
    const urlSort = searchParams.get('sort');
  
    if (urlSort) {
      setSortOrder(urlSort);
    }
  }, []);

  //const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', 1);
    setSearchParams(params);
  }, [selectedProductBrand, selectedCategories, priceRange, brandSearch]);

  const updatePage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
  };

  const totalPages = Math.ceil((data?.total || 0) / limit);
  const products = data?.products || [];

  //console.log('Products:', products);

  const hasActiveFilters =
    selectedProductBrand.length > 0 ||
    selectedCategories.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 1000000 ||
    search;

  return (
    <Inner>
      <ReactLenis root>
        <section className='min-h-[50vh] px-[3%] mt-1 bg-gray-50 py-2'>
          <div className='grid grid-cols-[25%_75%] gap-2 ProdContain89'>
            
            <div className='p-2 BuyerSideBAr'>
              <BuyerSideBar
                products={products}
                brands={filterData?.brands || []}
                categories={filterData?.categories || []}
                serverPriceRange={serverPriceRange}
                selectedProductBrand={selectedProductBrand}
                setSelectedProductBrand={setSelectedProductBrand}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                brandSearch={brandSearch}
                setBrandSearch={setBrandSearch}
              />
            </div>

            <div className='flex flex-col gap-3 p-2'>
              
              <div className='flex items-center justify-between prodHeadings'>
                <div className='flex flex-col gap-2'>
                  <p className='text-sm text-gray-500'>
                    Showing {products.length} of {data?.total || 0} products
                  </p>
                  <h2 className='text-xl text-dark'>
                    Product catalogue
                  </h2>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <button 
                      onClick={() => setSortOpen(!sortOpen)}
                      className='flex items-center text-gray-500 text-base gap-2 cursor-pointer'>
                        Sort by <FaChevronDown className='' />
                    </button>

                    {sortOpen && (
                      <div className='absolute right-0 mt-2 w-40 bg-white rounded shadow-md z-50'>
                        <button
                          onClick={() => {
                            setSortOrder('newest');
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                            sortOrder === 'newest' ? 'font-medium text-primary' : ''}`}
                            >
                              Newest
                        </button>

                        <button
                          onClick={() => {
                            setSortOrder('oldest');
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                            sortOrder === 'oldest' ? 'font-medium text-primary' : ''}`}
                            >
                              Oldest
                        </button>
                      </div>
                    )}
                  </div>
                  <IoGrid className='cursor-pointer text-secondary buyerIcon1' size={20}/>
                  <AiOutlineBars className='cursor-pointer text-secondary buyerIcon1' size={20}/>
                </div>
              </div>

              <div className='p-2'>
                
                {isLoading && (
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3'>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <ProductSkeleton key={i} />
                    ))}
                  </div>
                )}

                {isError && (
                  <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                    <MdError className='text-red-500' size={45} />
                    <p className='text-red-500'>Failed to load products</p>
                  </div>
                )}

                {!isLoading && !isError && (
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={`${products.length}-${sortOrder}-${page}`}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3 }}
                      className='grid grid-cols-4 gap-2 productCards65'
                    >
                      {products.length > 0 ? (
                        products.map((product, index) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))
                      ) : (
                        <div className='col-span-full text-center text-gray-500 flex flex-col items-center gap-2'>
                          <MdRemoveShoppingCart className='text-red-500' size={45} />
                          <p className=''>No products found / match your filter</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {totalPages > 1 && (
                <div className='flex bg-gray-200 p-1 rounded justify-center items-center gap-2 mt-6 flex-wrap'>
                  
                  <button
                    onClick={() => updatePage(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className='p-1 border rounded disabled:opacity-50 cursor-pointer'
                  >
                    <IoChevronBack size={20} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => updatePage(pageNumber)}
                        className={`px-3 text-sm py-1 border rounded  cursor-pointer ${
                          page === pageNumber
                            ? 'text-white bg-primary'
                            : 'border-gray-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => updatePage(Math.min(page + 1, totalPages))}
                    disabled={page === totalPages}
                    className='p-1 border rounded disabled:opacity-50 cursor-pointer'
                  >
                    <IoChevronForward size={20} />
                  </button>

                </div>
              )}

            </div>
          </div>
        </section>
        
        <section className='min-h-[30vh] px-[3%] my-6 bg-white'>
          <div className='flex items-center justify-between CatTexts001'>
            <h2 className='font-semibold text-xl flex items-center gap-1 mb-4 pdosC'>
              <span className='underline decoration-secondary decoration-2 underline-offset-4'>
                Featured 
              </span>
              <span>products</span>
            </h2>

            <a 
              className='text-base flex items-center gap-2 cursor-pointer text-dark hover:text-primary hover:underline'>
              Featured <FaLongArrowAltRight className='' />
            </a>
          </div>

          <div className='grid grid-cols-5 gap-3 productCards65'>
            {featureLoading && ( 
              Array.from({ length: 4 }).map((_, i) => 
              <ProductSkeleton key={i} /> 
              ) 
            )}

            {featureError && (
              <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                <MdError className='text-red-500' size={45} />
                <p className='text-red-500'>Failed to load featured products</p>
              </div>
            )}

            {!featureLoading && !featureError && (
              featuredProducts.length > 0 ? (
                featuredProducts.slice(0,5).map((product, index) => (
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
                  <p>No featured products found</p>
                </div>
              )
            )}
          </div>
        </section>

        <div className='p-2'>
         <Footer />
        </div>
      </ReactLenis>
    </Inner>
  );
}

export default Products;