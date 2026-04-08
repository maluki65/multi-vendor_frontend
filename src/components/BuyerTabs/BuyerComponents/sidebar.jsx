import React, { useState, useMemo, useCallback } from 'react';
import '../BuyerTabs.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { debounce } from 'lodash';
import useCategory from '../../../Hooks/useCategory';

function BuyerSideBar({
  products,
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
  const [isCategoryOpen, setIsCategoryOpen] = useState(null);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const { getActiveCategories } = useCategory();
  const { data: categories = [] } = getActiveCategories;
  
  const brands = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    const allBrands = products.map(p => p.brand).filter(Boolean);
    return [...new Set(allBrands)];
  }, [products]);

  const priceRanges = [
    { label: 'Under 1K', value: 'under1k', range: [0, 1000] },
    { label: '1K - 10K', value: '1k-10k', range: [1000, 10000] },
    { label: '10K - 100K', value: '10k-100k', range: [10000, 100000] },
    { label: '100K+', value: '100k+', range: [100000, 1000000] },
    { label: 'Custom', value: 'custom' }
  ];

  const toogleBrand = (brand) => {
    setSelectedProductBrand(prev => 
      prev.includes(brand)
       ? prev.filter(b => b !== brand)
       : [...prev, brand]
    );
  };

  const toogleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
       ? prev.filter(c => c !== category)
       : [...prev, category]
    );
  };

  const handlePriceSelect = (rangeValue) => {
    setSelectedPriceRange(rangeValue);
    const selected = priceRanges.find(p => p.value === rangeValue);
    if (selected?.range) {
      setPriceRange(selected.range);
    }
  };

  const safeSelectedBrands = selectedProductBrand || [];

  const filteredBrands = useMemo(() => {
    const lower = (brandSearch || '').toLowerCase();

    const searched = brands.filter(b => 
      b.toLowerCase().includes(lower)
    );

    return Array.from(new Set([ 
      ...safeSelectedBrands, 
      ...searched
    ]));
  }, [brands, brandSearch, safeSelectedBrands]);

  const debounceSearch = useCallback(
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
            setPriceRange([0, 1000000]);
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
          onClick={() => setIsBrandOpen(!isBrandOpen)}
          >
            brands
            {isBrandOpen ? <FaChevronDown className=''/> : <FaChevronRight className='' />}
          </button>

          {isBrandOpen && (
            <>
              <input
                type='text'
                placeholder='Search by Brand'
                value={brandSearch}
                onChange={(e) => debounceSearch(e.target.value)}
                className='w-full p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
              />

              <div className='flex flex-col gap-1 max-h-[170px] overflow-y-auto my-3'>
                {filteredBrands.map((brand, i) => (
                  <label key={i}
                    className='flex items-center gap-2 text-sm'>
                      <input
                        type='checkbox'
                        checked={selectedProductBrand.includes(brand)}
                        onChange={() => toogleBrand(brand)}
                      />
                      <span className=''>{brand}</span>
                    </label>
                ))}
              </div>
            </>
          )}
      </div>

      <div className='mb-4'>
        <button
          className='w-full flex justify-between items-center font-semibold mb-2'
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            Categories
            {isCategoryOpen ? <FaChevronDown className=''/> : <FaChevronRight className='' />}
        </button>

        {isCategoryOpen && (
          <div className='flex flex-col gap-1 max-h-[200px] overflow-y-auto'>
            {categories.map((cat, i) => (
              <label key={i} 
                className='flex items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={selectedCategories.includes(cat?.name)}
                    onChange={() => toogleCategory(cat?.name)}
                  />
                  <span className=''>{cat?.name}</span>
                </label>
            ))}
          </div>
        )}
      </div>

      <div className='mb-4'>
        <button
          className='w-full flex justify-between items-center font-semibold gap-2'
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          >
            Price Range
            {isPriceOpen? <FaChevronDown className=''/> : <FaChevronRight className='' />}
        </button>

        {isPriceOpen && (
          <>
            <div className='flex flex-col gap-1 text-sm mb-2'>
              {priceRanges.map((range) => (
                <label key={range.value}
                  className='flex items-center gap-2'>
                    <input
                      type='radio'
                      checked={selectedPriceRange === range.value}
                      onChange={() => handlePriceSelect(range.value)}
                    />
                    <span className=''>{range.label}</span>
                </label>
              ))}
            </div>

            {selectedPriceRange === 'custom' && (
              <>
                <Slider
                  range
                  min={0}
                  max={1000000}
                  value={priceRange}
                  onChange={setPriceRange}
                />

                <div className='text-sm mt-2'>
                  Ksh {priceRange[0].toLocaleString()} - Ksh {priceRange[1].toLocaleString()}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BuyerSideBar