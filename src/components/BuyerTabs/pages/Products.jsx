import React, { useState, useMemo, useEffect } from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import useProducts from '../../../Hooks/useProduts';
import ProductSkeleton from '../BuyerItems/productSkeleton';
import { FaChevronDown } from "react-icons/fa6";
import { IoGrid } from "react-icons/io5";
import { AiOutlineBars } from "react-icons/ai";
import { BuyerSideBar } from '../../';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../BuyerItems/productCard';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdRemoveShoppingCart, MdError } from "react-icons/md";

function Products() {
  const [selectedProductBrand, setSelectedProductBrand] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [brandSearch, setBrandSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const filters = { 
    page, 
    limit 
  };

  if (selectedProductBrand.length > 0)
    filters.brand = selectedProductBrand.join(',');
  
  if (selectedCategories.length > 0)
    filters.category = selectedCategories.join(',');
  
  if (priceRange[0] > 0) filters.minPrice = priceRange[0];
  if (priceRange[1] < 1000000) filters.maxPrice = priceRange[1];
  if (brandSearch) filters.search = brandSearch;

  const { getAllProducts } = useProducts();
  const { data, isLoading, isError } = getAllProducts(filters);

  useEffect(() => {
    setPage(1);
  }, [selectedProductBrand, selectedCategories, priceRange, brandSearch]);

  const totalPages = Math.ceil((data?.total || 0) / limit);

  //console.log(data?.products);
  const hasActiveFilters =
    selectedProductBrand.length > 0 ||
    selectedCategories.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 1000000;

    const filteredProducts = useMemo(() => {
      const allProducts = data?.products || [];
    
      if (!hasActiveFilters) return allProducts;
    
      return allProducts.filter(product => {
        const brand = (product?.brand || '').toLowerCase();
        const category = (product?.category?.name || product?.category || '').toLowerCase();
        const price = Number(product?.price) || 0;
    
        const matchedBrand =
          selectedProductBrand.length === 0 ||
          selectedProductBrand
            .map(b => b.toLowerCase())
            .includes(brand);
    
        const matchedCategory =
          selectedCategories.length === 0 ||
          selectedCategories
            .map(c => c.toLowerCase())
            .includes(category);
    
        const matchPrice =
          price >= priceRange[0] &&
          price <= priceRange[1];
    
        return matchedBrand && matchedCategory && matchPrice;
      });
    }, [data, selectedProductBrand, selectedCategories, priceRange, hasActiveFilters]);

  return (
    <Inner>
      <section className='min-h-[50vh] px-[3%] my-6 overflow-hidden bg-gray-100 py-4'>
        <div className='grid grid-cols-[25%_75%] gap-2'>
          <div className='p-2'>
            <BuyerSideBar
              products={data?.products || []}
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
            <div className='flex items-center justify-between'>
              <div className='flex flex-col gap-2'>
                <p className='text-sm text-gray-500'>
                  Showing {filteredProducts.length} of {data?.total} products
                </p>
                <h2 className='text-xl text-dark'>
                  Product catalogue
                </h2>
              </div>

              <div className='flex items-center gap-2'>
                <p className='flex items-center text-gray-500 text-base gap-2'>Sort by <FaChevronDown  className=''/></p>
                <IoGrid className='cursor-pointer text-secondary'  size={20}/>
                <AiOutlineBars className='cursor-pointer text-secondary' size={20}/>
              </div>
            </div>

            <div className='p-2'>
              {isLoading && (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3'>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              )}

              {isError && (
                <div className='col-span-full text-center text-gray-500 flex items-center justify-center flex-col gap-2'>
                  <MdError className='text-red-500' size={45} />
                  <p className='text-red-500'>Failed to load products</p>
                </div>
              )}

              {!isLoading && !isError && (
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={filteredProducts.length}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className='grid grid-cols-4 gap-2'>
                      {filteredProducts .length > 0 ? (
                        filteredProducts.map((product, index) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className='relative'
                            >
                            {!filteredProducts && (
                              <div className='absolute inset-0 z-10'>
                                <ProductSkeleton />
                              </div>
                            )}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4 }}
                              >
                               <ProductCard product={product} />
                            </motion.div>
                          </motion.div>
                        ))
                      ) : (
                        <div className='col-span-full text-center text-gray-500 flex items-center justify-center flex-col gap-2'>
                          <MdRemoveShoppingCart className='text-red-500' size={45} />
                          <p className=''>No products found/match your filter</p>
                        </div>
                      )}
                    </motion.div>
                </AnimatePresence>
              )}
            </div>

            {totalPages > 1 && (
              <div className='flex justify-center items-center gap-2 mt-6 flex-wrap'>
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className='p-1 border rounded disabled:opacity-50 cursor-pointer'
                >
                  <IoChevronBack className='' size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`px-3 py-1 border rounded cursor-pointer ${
                        page === pageNumber
                          ? 'text-white bg-primary font-medium'
                          : 'border-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className='p-1 border rounded disabled:opacity-50 cursor-pointer'
                >
                  <IoChevronForward className='' size={20} />
                </button>
              </div>
            )}
            
          </div>

                  
        </div>
      </section>
    </Inner>
  )
}

export default Products