import React, { useState, useRef, useMemo} from 'react';
import './Table.css';
import { IoEllipsisVerticalSharp } from "react-icons/io5";

const ActionPopUp = ({ row, onEdit, onToggleStatus }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return() => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAction = (action) => {
    setOpen(false);
    if (action === 'Edit') onEdit(row)
    if (action === 'ToggleStatus') onToggleStatus(row);
  };

  return ( 
    <div className='relative' ref={menuRef}>
      <button 
        className='p-2 cursor-pointer font-semibold'
        onClick={(e) => {
          e.stopPropagation();
          setOpen(prev => !prev);
        }}
        >
          <IoEllipsisVerticalSharp />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border shadow-lg rounded z-10"
             onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleAction('Edit')}
            className="block w-full text-left px-3 py-1 rounded hover:bg-gray-100 text-sm cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => handleAction('ToggleStatus')}
            className="block w-full text-left px-3 py-1 rounded hover:bg-gray-100 text-sm cursor-pointer"
          >
            {row.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionPopUp