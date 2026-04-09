import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;

    const params = new URLSearchParams();
    params.set('search', searchQuery);
    params.set('page', 1);

    const targetUrl = `/buyer/products?${params.toString()}`;

    if (location.pathname !== '/buyer/products'){
      navigate(targetUrl);
    } else {
      navigate({
        pathname: '/buyer/products',
        search: params.toString(),
      });
    }
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      handleSearch(query);
    }
  };

  return (
    <div className='relative flex items-center w-full'>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Search by name or brand'
        className='ml-2 px-3 py-1 outline-none border focus:bg[#dfdede] w-full focus:border-[1.5px] focus:border-orange-400 rounded-lg'
      />
    </div>
  );
}

export default SearchBar