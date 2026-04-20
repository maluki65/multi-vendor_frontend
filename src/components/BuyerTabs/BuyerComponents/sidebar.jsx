import React, { useState, useMemo, useCallback } from 'react';
import '../BuyerTabs.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { debounce } from 'lodash';
import useCategory from '../../../Hooks/useCategory';

function BuyerSideBar({
  products = [],
  selectedProductBrand,
  setSelectedProductBrand,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  brandSearch,
  setBrandSearch,
}) {

  const [selectedPriceRange, setSelectedPriceRange] = useState('custom');
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const { getActiveCategories } = useCategory();
  const { data: categories = [] } = getActiveCategories;
  //console.log(categories);

  const brands = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p?.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  const priceRanges = [
    { label: 'Under 1K', value: 'under1k', range: [0, 1000 * 100] },
    { label: '1K - 10K', value: '1k-10k', range: [1000 * 100, 10000 * 100] },
    { label: '10K - 100K', value: '10k-100k', range: [10000 * 100, 100000 * 100] },
    { label: '100K+', value: '100k+', range: [100000 * 100, 1000000 * 100] },
    { label: 'Custom', value: 'custom' }
  ];

  const toggleBrand = (brand) => {
    setSelectedProductBrand(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  
  const handlePriceSelect = (value) => {
    setSelectedPriceRange(value);

    const selected = priceRanges.find(p => p.value === value);
    if (selected?.range) {
      setPriceRange(selected.range); 
    }
  };

  const filteredBrands = useMemo(() => {
    const lower = (brandSearch || '').toLowerCase();

    return brands.filter(b =>
      b.toLowerCase().includes(lower)
    );
  }, [brands, brandSearch]);

  const debouncedBrandSearch = useCallback(
    debounce((val) => setBrandSearch(val), 300),
    []
  );

  return (
    <div className='p-4 rounded-md border border-gray-200 shadow-md bg-white BuyerSideBar'>

      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-xl font-semibold text-dark'>Filters</h1>

        <button
          onClick={() => {
            setSelectedProductBrand([]);
            setSelectedCategories([]);
            setPriceRange([0, 1000000 * 100]); 
            setSelectedPriceRange('custom');
            setBrandSearch('');
          }}
          className='text-green-600 text-sm cursor-pointer hover:underline'
        >
          Reset All
        </button>
      </div>

      <div className='my-4'>
        <button
          className='w-full flex justify-between items-center font-semibold mb-2'
          onClick={() => setIsBrandOpen(prev => !prev)}
        >
          Brands
          {isBrandOpen ? <FaChevronDown /> : <FaChevronRight />}
        </button>

        {isBrandOpen && (
          <>
            {/*<input
              type='text'
              placeholder='Search brand'
              onChange={(e) => debouncedBrandSearch(e.target.value)}
              className='w-full p-2 rounded-lg bg-[#ebe7e7] outline-none focus:border-[1.5px] focus:border-orange-500'
            />*/}

            <div className='flex flex-col gap-1 max-h-[170px] overflow-y-auto my-3'>
              {filteredBrands.map((brand, i) => (
                <label key={i} className='flex items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={selectedProductBrand.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span className='font-medium'>{brand}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      <div className='mb-4'>
        <button
          className='w-full flex justify-between items-center font-semibold mb-2'
          onClick={() => setIsCategoryOpen(prev => !prev)}
        >
          Categories
          {isCategoryOpen ? <FaChevronDown /> : <FaChevronRight />}
        </button>

        {isCategoryOpen && (
          <div className='flex flex-col gap-1 max-h-[200px] overflow-y-auto'>
            {categories.map((cat) => (
              <label key={cat._id} className='flex items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => toggleCategory(cat._id)}
                />
                <span className='font-medium'>{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className='mb-4'>
        <button
          className='w-full flex justify-between items-center font-semibold'
          onClick={() => setIsPriceOpen(prev => !prev)}
        >
          Price Range
          {isPriceOpen ? <FaChevronDown /> : <FaChevronRight />}
        </button>

        {isPriceOpen && (
          <>
            <div className='flex flex-col gap-1 text-sm mb-2'>
              {priceRanges.map((range) => (
                <label key={range.value} className='flex items-center gap-2'>
                  <input
                    type='radio'
                    checked={selectedPriceRange === range.value}
                    onChange={() => handlePriceSelect(range.value)}
                  />
                  <span className='font-medium'>{range.label}</span>
                </label>
              ))}
            </div>

            {selectedPriceRange === 'custom' && (
              <>
                <Slider
                  range
                  min={0}
                  max={1000000 * 100} 
                  value={priceRange}
                  onChange={setPriceRange}
                />

                <div className='text-sm mt-2'>
                  Ksh {(priceRange[0] / 100).toLocaleString()} - Ksh {(priceRange[1] / 100).toLocaleString()}
                </div>
              </>
            )}
          </>
        )}
      </div>

    </div>
  );
}

export default BuyerSideBar;