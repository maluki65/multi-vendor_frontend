import React, { useState, useMemo, useEffect, useRef } from 'react';
import './Tabs.css';
import { Api } from '../../utils';
import { CSVLink } from 'react-csv';
import { Toaster, toast } from 'react-hot-toast';
import { IoCloudDownload, IoEllipsisVerticalSharp, IoSearch  } from "react-icons/io5";
import { useAuth } from '../../Context/AuthContext';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';


const ActionPopUp = ({ onDelete, onOpenUserModal, onOpenRoleModal }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

 React.useEffect(() => {
    const handler = (e) => {
      if(menuRef.current && !menuRef.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAction = (action) => {
    setOpen(false);
    if (action === 'View')
      onOpenUserModal(row);
    if (action === 'Update role')
      onOpenRoleModal(row);
    if (action === 'Delete') onDelete(row._id);
  }

  return (
    <div className='relative' ref={menuRef}>
      <button
        className='px-2 py-1 bg-gray-300 rounded font-semibold'
        onClick={(e) => { 
          e.stopPropagation();
          setOpen(prev => !prev);
          }}
        >
          <HiDotsVertical/>
      </button>
      {open && (
        <div 
        className='absolute right-0 mt-1 w-36 bg-white border shadow-lg rounded z-10'
         onClick={e => e.stopPropagation()}
        >
          {['View', 'Update role', 'Delete'].map(act => (
            <button
              key={act}
              onClick={() => handleAction(act)}
              className='block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm'
              >
                {act}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg w-11/12 max-w-md'>
        {children}
      </div>
      <button
        className='mt-4 px-3 py-1 bg-gray-500 text-white rounded cursor-pointer ml-2'
        onClick={onClose}
        >
          Close
      </button>
    </div>
  );
};

function Users() {
  const { userData } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('username'|| 'storeName');
  const [sortOrder, setSortOrder] = useState('asc');

  const [roleModal, setRoleModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectUser, setSelectUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  const queryClient = useQueryClient();
  const loggedInUserId = userData?._id;
  const limit = 10;

  const fetchUsers = async({ queryKey }) => {
    const [_KEY, {page, search }] = queryKey;
    const res = await Api.get(`/admin/users?search=${search}&page=${page}&limit=${limit}`);
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['users',{ page, search }],
    queryFn: fetchUsers,
    keepPreviousData: true,
  });

  const fiteredUsers = useMemo(() => {
    if (!data?.data) return[];

    const s = search.toLowerCase();

    return data.data.filter(row => row._id !== loggedInUserId)
      .filter(row => {
        return (
          row.username?.toLowerCase().includes(s) ||
          row.storeName?.toLowerCase().includes(s) ||
          row.email?.toLowerCase().includes(s)
        );
      })
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, sortField, sortOrder, loggedInUserId]);

  //const handleDeleteUser = useDeleteUser();

  const onOpenRoleModal = (user) => {
    setSelectUser(user);
    setNewRole(user.role);
    setRoleModal(true);
  }

  /*const submitRoleUpdate = async () => {
    try {
      await Api.patch(`.../${selectUser._id}/role`, { role: newRole });
      toast.success('Role updated!');
      queryClient.invalidateQueries(['users']);
      setRoleModal(false);
    } catch(error){
      toast.error(error.response?.data?.message || 'Error updating user role');
      console.log('Error updating user role', error)
    }
  };*/

  const pages = data?.pages || 1;
  return (
    <div className='p-4'>
      <Toaster position='top-right' reverseOrder={false}/>
      <Modal isOpen={roleModal} onClose={() => setRoleModal(false)}>
        <h2 className='text-lg font-semibold mb-2'>Update Role for {selectUser?.username || selectUser?.storeName}</h2>
        <select
          type='text'
          required
          className='p-2 outline-none focus:bg-amber-50 focus:border-2 rounded bg-amber-100 w-full'
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          >
            <option value=''>Select Role'</option>
            <option value='Admin'>Admin</option>
            <option value='Vendor'>Vendor</option>
            <option value='Buyer'>Buyer</option>
        </select>
        <button className='px-4 py-2 bg-primary text-white rounded'
          /*onClick={submitRoleUpdate}*/>
            Update Role
          </button>
      </Modal>
      <Modal isOpen={viewModal} onClose={() => setViewModal(false)}>
        <h2 className='text-lg font-semibold mb-2'>Profile for {selectUser?.username || selectUser?.storeName}</h2>
        
        <div className='bg-red-600 text-light'>Test Profile</div>
      </Modal>

      <div className='flex flex-col p-2 space-y-2 bg-white rounded-xl'>
        <div className='p-2 flex justify-between items-center'>
         <div className='flex items-center gap-3'>
          <HiOutlineUserCircle  className='' size={40} strokeWidth={1}/>
          <h2 className='font-semibold text-xl'>Users</h2>
         </div>
         <div className='flex items-center gap-3'>
          <CSVLink 
            className='px-2 py-1 border flex gap-2 items-center text-primary text-sm border-primary rounded cursor-pointer'
            data={fiteredUsers}
            filename='users.csv'
             >
            Actions via CSV 
            <span className=''>
              <IoCloudDownload className='' />
            </span>
          </CSVLink>
          <button className='px-2 py-1 bg-primary rounded text-white cursor-pointer text-sm'> + New</button>
          <button className='px-2 py-1 border border-primary  rounded text-primary cursor-pointer'>
            <IoEllipsisVerticalSharp className='' />
          </button>
         </div>
        </div>
        <AnimatePresence mode='wait'>
          <div className='flex flex-col gap-3 px-4'>
           <div className='flex items-end justify-between '>
            <div className='relative flex items-center gap-2 flex-1'>
                <IoSearch className='absolute left-3 text-gray-400 pointer-events-none text-sm' />
                <input
                  type='text'
                  placeholder='Search user by UUID/name'
                  name='search'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='pl-10 pr-3 py-1 border border-dark max-w-fit rounded-xl bg-transparent focus:border-[1.5px] focus:outline-0 focus:border-gray-600 w-full'
                />
            </div>
            <h1 className='text-sm text-primary cursor-pointer hover:underline'>Export users</h1>
           </div>
           <motion.div className='bg-transparent p-2 overflow-x-auto'>Table</motion.div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Users