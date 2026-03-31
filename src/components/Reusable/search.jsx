import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';

function SearchBar({ onSearch }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  }; 

  return (
    <div className='flex items-center relative'>
    <AnimatePresence>
      {open && (
        <motion.input
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 400, opacity:1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ dyration: 0.3 }}
          type='text'
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder='Search product...'
          className='ml-2 px-3 py-1 outline-none  focus:bg-[#dfdede] border focus:border-[1.5px] focus:border-orange-400 rounded-lg'
        />
      )}
    </AnimatePresence>

      <IoIosSearch
        className='cursor-pointer'
        size={25}
        onClick={() => setOpen(prev => !prev)}
      />      
    </div>
  );
};

export default SearchBar