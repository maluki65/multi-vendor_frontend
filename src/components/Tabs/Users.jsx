import React, { useState, useMemo, useEffect, useRef } from 'react';
import './Tabs.css';
import { Api } from '../../utils';
import { debounce } from 'lodash';
import { CSVLink } from 'react-csv';
import { Toaster, toast } from 'react-hot-toast';
import { IoCloudDownload, IoEllipsisVerticalSharp, IoSearch, IoTrashOutline  } from "react-icons/io5";
import { useAuth } from '../../Context/AuthContext';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useDeleteUser from '../Tabs/deleteUser';
import { FaInstagram, FaFacebook, } from "react-icons/fa";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import  { AdLoader } from '..';
import { GrFormViewHide } from "react-icons/gr";
import { TbEdit } from "react-icons/tb";


const ActionPopUp = ({ row, onDelete, onOpenUserModal, onOpenRoleModal }) => {

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if(menuRef.current && !menuRef.current.contains(e.target)) {
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
        className='p-2 cursor-pointer font-semibold'
        onClick={(e) => { 
          e.stopPropagation();
          setOpen(prev => !prev);
          }}
        >
          <IoEllipsisVerticalSharp/>
      </button>
      {open && (
        <div 
        className='absolute right-0 mt-1 w-36 bg-white border shadow-lg rounded z-10 Upop'
         onClick={e => e.stopPropagation()}
        >
          {['View', 'Update role', 'Delete'].map(act => (
            <button
              key={act}
              onClick={() => handleAction(act)}
              className='block w-full text-left px-3 py-1 rounded hover:bg-gray-100 text-sm'
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
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white p-1 rounded-2xl w-11/12 max-w-3xl max-h-[80vh] flex flex-col VenProModal'>
        <div className='overflow-y-auto'>
          {children}
        </div>
        <div className='p-4'>
          <button 
            className='mt-4 px-3 py-1 bg-gray-500 text-white rounded cursor-pointer ml-2 justify-end'
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function Users() {
  const { userData } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortField, setSortField] = useState('username'|| 'storeName');
  const [sortOrder, setSortOrder] = useState('asc');

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileData, setProfileData] = useState(null);
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

    const source = search ? suggestions : data.data;

    return source
      .filter(row => row._id !== loggedInUserId)
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, suggestions, sortField, sortOrder, loggedInUserId, search]);

  //const handleDeleteUser = useDeleteUser();

  const handleSearch = debounce(async(value) => {
    setSearch(value);

    if (!value) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await Api.get(`/admin/search?search=${value}&page=1&limit=10`);
      setSuggestions(res.data.data || []);
      setShowSuggestions(true);
    } catch (error){
      console.error('Error searching user:', error);
      setSuggestions([]);
      setShowSuggestions(true);
    }
  }, 300);

  const openRoleModal = (user) => {
    setSelectUser(user);
    setNewRole(user.role);
    setRoleModal(true);
  }

  const openUserModal = async (user) => {
    setSelectUser(user);
    setViewModal(true);

    setProfileLoading(true);
    setProfileData(null);
    setProfileMessage('');

    try {
      let endPoint = '';

      if (user.role === 'Vendor') {
        endPoint = `/admin/vendors/${user._id}/profile`;
      } else if (user.role === 'Buyer') {
        endPoint = `/admin/buyers/${user._id}/profile`;
      } else {
        setProfileMessage('Admins does not have profiles.');
        setProfileLoading(false);
        return;
      }

      const res = await Api.get(endPoint);

      if (!res.data.profile) {
        setProfileMessage(res.data.message || 'This user does not a profile yet!');
      } else {
        setProfileData(res.data.profile);
      }

    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setProfileMessage('Failed to fetch profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const submitRoleUpdate = async () => {
    try {
      //console.log(selectUser._id)
      //console.log(newRole)
      await Api.patch(`/admin/promote/${selectUser._id}/`, { role: newRole });
      toast.success('Role updated!');
      queryClient.invalidateQueries(['users']);
      setRoleModal(false);
    } catch(error){
      toast.error(error.response?.data?.message || 'Error updating user role');
      console.log('Error updating user role', error)
    }
  };

  const pages = data?.pages || 1;

  const columns = [
    { label: 'User/Storename', field: 'username' },
    { label: 'UserId', field: 'userId' },
    { label: 'Status', field: 'status' },
    { label: 'Role', field: 'role' },
  ];

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    approved: 'bg-green-100 text-green-700 border-green-300',
    rejected: 'bg-red-100 text-red-700 border-red-300',
  }

  const displayName = selectUser
  ? selectUser.username !== 'None'
    ? selectUser.username
    : selectUser.storeName !== 'None'
      ? selectUser.storeName
      : 'N/A'
  : 'N/A';

  const handleDelete = useDeleteUser();

  return (
    <div className='p-4'>
      <Toaster position='top-right' reverseOrder={false}/>
      <Modal isOpen={roleModal} onClose={() => setRoleModal(false)}>
        <h2 className='p-4 text-lg font-semibold mb-2 text-black'>Update Role for {displayName}</h2>
        <select
          type='text'
          required
          className='p-4 outline-none focus:bg-amber-50 focus:border-2 rounded bg-amber-100 w-full'
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          >
            <option value=''>Select Role</option>
            <option value='Admin'>Admin</option>
            <option value='Vendor'>Vendor</option>
            <option value='Buyer'>Buyer</option>
        </select>
        <button className='my-3 px-3 py-1 bg-primary text-white rounded cursor-pointer'
          onClick={submitRoleUpdate}>
            Update Role
          </button>
      </Modal>
      <Modal  isOpen={viewModal} onClose={() => setViewModal(false)}>
        {/*<h2 className='text-lg font-normal mb-2'>Profile for {displayName}</h2>*/}
        
        {profileLoading ? (
          <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
            <AdLoader/>
          </div>
        ) : profileMessage ? (
          <p className='text-red-500 p-4'>
            {profileMessage}
          </p>
        ) : profileData ? (
            <div className='w-full bg-white rounded-2xl overflow-hidden relative'>
              <div className='h-40 w-full relative VenBanCon'>
                <img
                  src={profileData?.banner}
                  alt='banner'
                  className='w-full h-full object-cover bannerImg'
                  loading='lazy'
                />
                {/*<button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-700 hover:scale-105 transition">
                  pen
                </button>*/}
              </div>

              <div className='relative px-8 pt-15'>
                <div className='absolute -top-16 left-8'>
                  <div className='w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-md logoImg'>
                    <img 
                      src={profileData?.logo}
                      alt='logo'
                      loading='lazy'
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-col spac-y-2 VenProcontent'>
                <div className='px-4 flex items-start justify-between VenBusiness'>
                  <div className='flex flex-col'>
                    <h1 className='text-xl font-semibold text-dark flex items-center gap-2'>
                      {profileData?.businessInfo.legalName}

                      {profileData?.verification.isverified && (
                        <div className='relative group'>
                          <RiVerifiedBadgeFill className='text-blue-500 text-lg cursor-pointer VenIcon' size={20}/>
                          <span className='absolute -bottom-7 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition'>
                            Verified Account
                          </span>
                        </div>
                      )}
                    </h1>
                    <p className='text-sm text-muted'>
                      {profileData.store.contactEmail}
                    </p>
                  </div>
                  <p className='text-[#666666] text-sm'>TaxId: {profileData?.businessInfo.taxId}</p>
                </div>

                <div className='px-4 mt-3 grid grid-cols-4 gap-2 items-center VenAddresses'>
                  <div className='flex flex-col'>
                    <p className='text-muted text-sm'>
                      First seen
                    </p>
                    <p className='text-dark text-md'>
                      {profileData?.createdAt && 
                        new Date(profileData.createdAt)
                        .toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                    </p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-muted text-sm'>
                      City
                    </p>
                    <p className='text-dark text-md'>
                      {profileData?.store.addresses.city}
                    </p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-muted text-sm'>
                      Street
                    </p>
                    <p className='text-dark text-md'>
                      {profileData?.store.addresses.street}
                    </p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-muted text-sm'>
                      Postal Code
                    </p>
                    <p className='text-dark text-md'>
                      {profileData?.store.addresses.postal}
                    </p>
                  </div>
                </div>

                {profileData?.payout && (
                  <div className='mt-3 p-4 payout'>
                    <h2 className='text-md font-semibold mb-2 text-dark'>
                      Payout Infomation
                    </h2>

                    <p className='text-sm mb-2'>
                      <span className='font-medium'>Payment Method:</span> {profileData?.payout.method}
                    </p>

                    <ul className='text-sm text-dark space-y-1'>
                      {profileData?.payout.method === 'Bank' && ['bank', 'accountName', 'accountNumber'].map((key) => {
                        const value = profileData.payout[key];
                        if (!value) return null;
                        const labels = {
                          bank: 'Bank Name',
                          accountName: 'Account Name',
                          accountNumber: 'Account Number',
                        };

                        return (
                          <li key={key} className='flex justify-between'>
                            <span className='font-semibold'>
                              {labels[key]}
                            </span>
                            <span>
                              {value}
                            </span>
                          </li>
                        );
                      })}

                      {profileData.payout.method === 'mobile_money' && ['provider', 'paybill', 'paybillAcc', 'tillNumber', 'pochiLaBiashara'].map((key) => {
                        const value = profileData.payout[key];
                        if (!value) return null;
                        const labels = {
                          provider: 'Provider',
                          paybill: 'Paybill',
                          paybillAcc: 'Paybill Account',
                          tillNumber: 'Till Number',
                          pochiLaBiashara: 'Poch La Biashara',
                        };
                        return (
                          <li key={key} className='flex justify-between'>
                            <span className='font-semibold'>{labels[key]}</span>
                            <span className='text-muted'>
                              {value}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {profileData?.socialLinks && (
                  <div className='grid items-center my-3 px-4 grid-cols-4 gap-2 socials'>
                    {[
                      { 
                        name: 'Instagram', 
                        icon: FaInstagram, 
                        link: profileData?.socialLinks.instagram,
                        className: 'text-white hover:text-light bg-primary px-2 py-1 rounded flex justify-center'
                      },
                      { 
                        name: 'Facebook', 
                        icon: FaFacebook, 
                        link: profileData?.socialLinks.facebook,
                        className: 'text-white hover:text-light bg-primary px-2 py-1 rounded flex justify-center' 
                      },
                      { 
                        name: 'TikTok', 
                        icon: FaTiktok, 
                        link: profileData?.socialLinks.tiktok,
                        className: 'bg-black text-white hover:text-light px-2 py-1 rounded flex justify-center'
                      },
                      { 
                        name: 'X', 
                        icon: FaXTwitter, 
                        link: profileData?.socialLinks.x,
                        className: 'bg-black text-white hover:text-light px-2 py-1 rounded flex justify-center'
                      },
                    ]
                      .filter(item => item.link)
                      .map((item, index) => (
                        <a
                          key={index}
                          href={item.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={`flex text-sm items-center gap-2 cursor-pointer hover:underline ${item.className}`}
                        >
                          <item.icon className='text-lg VenSocialIcon' />
                          {item.name}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            </div>
        ) : (
          <p className=''>
            No profile data available
          </p>
        )}
      </Modal>

      <div className='flex flex-col p-2 space-y-2 bg-white rounded-xl'>
        <div className='p-2 flex justify-between items-center userIc'>
         <div className='flex items-center gap-3'>
          <HiOutlineUserCircle  className='' size={40} strokeWidth={1}/>
          <h2 className='font-semibold text-xl'>Users</h2>
         </div>
         <div className='flex items-center gap-3 userCSVs'>
          <CSVLink 
            className='px-2 py-1 border flex gap-2 items-center text-primary text-sm border-primary rounded cursor-pointer CSVAct'
            data={fiteredUsers}
            filename='users.csv'
             >
            Actions via CSV 
            <span className=''>
              <IoCloudDownload className='' />
            </span>
          </CSVLink>
          <button className='px-2 py-1 bg-primary rounded text-white cursor-pointer text-sm CSVAct'> + New</button>
          <button className='px-2 py-1 border border-primary  rounded text-primary cursor-pointer CSVAct'>
            <IoEllipsisVerticalSharp className='' />
          </button>
         </div>
        </div>
        <AnimatePresence mode='wait'>
          <div className='flex flex-col gap-3 px-4'>
           <div className='flex items-end justify-between userInp'>
            <div className='relative'>
              <div className='relative flex items-center gap-2 flex-1'>
                  <IoSearch className='absolute left-3 text-gray-400 pointer-events-none text-sm' />
                  <input
                    type='text'
                    placeholder='Search user by UUID/name'
                    name='search'
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className='pl-10 pr-3 py-1 border border-dark max-w-fit rounded-xl bg-transparent focus:border-[1.5px] focus:outline-0 focus:border-gray-600 w-full'
                    onFocus={() => search && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
              </div>
              {showSuggestions && (
                <div className='absolute top-full left-0 w-full bg-white  border-gray-600 border-[1.5px] rounded-md shadow-md z-20 max-h-60 overflow-auto'>
                  {suggestions.length > 0 ? (
                    suggestions.map(user => (
                      <div 
                        key={user._id}
                        className='px-3 py-2 hover:bg-gray-100 cursor-pointer'
                        onClick={() => {
                          setSearch(user.username || user.storeName  || user.UUID);
                          setShowSuggestions(false);
                        }}
                      >
                        {user.username !== 'None' ? user.username : user.storeName || 'N/A'} ({ user.email})
                      </div>
                    ))
                  ): (
                    <div className='px-3 py-2 text-gray-500'>
                      No user found
                    </div>
                  )}
                </div>
              )
              }
            </div>
            <h1 className='text-sm text-primary cursor-pointer hover:underline'>Export users</h1>
           </div>
           <motion.div className='bg-transparent p-2 overflow-x-auto h-[53vh] overflow-y-auto userTableContainer'
             initial={{opacity: 0, scale: 0.95}}
             animate={{opacity: 1, scale: 1}}
             exit={{opacity: 0, scale: 0.95}}
             transition={{ duration: 0.3 }}>
              <table className='w-full border-collapse text-sm md:text-base userTable'>
                <thead className='border-t-[1.5px] border-b-[1.5px] border-gray-400'>
                  <tr>
                    <th className='p-2 text-left font-light'>#</th>
                    {columns.map(({label, field}) => (
                      <th
                        key={field}
                        className='p-2 text-left cursor-pointer font-light'
                        onClick={() => {
                          if (sortField === field) {
                            setSortField(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField(field);
                            setSortOrder('asc');
                          }
                        }}
                      >
                        {label}
                        {sortField === field && (sortOrder === 'asc' ?  ' ↑' : ' ↓')}
                      </th>
                    ))}
                    <th className='p-2 text-left cursor-pointer font-light'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading 
                    ? Array.from({ length: limit}).map((_, i) => (
                    <tr key={i}
                      className='border-b animate-pulse'>
                        {Array.from({length: 6 }).map((_, j) => (
                          <td key={j}
                          className='p-2 bg-gray-100 h-6'></td>
                        ))}
                      </tr>
                  ))
                  : fiteredUsers.map((row, index) => (
                    <React.Fragment key={row._id}>
                    <tr key={row._id}
                    className='hover:bg-gray-100'>
                      <td className='p-2 font-medium'>
                        {(page - 1 ) * limit + index + 1 }
                      </td>
                      <td className='p-2'>
                        {row.username !== 'None' && row.username
                          ? row.username
                          : row.storeName !== 'None' && row.storeName
                            ? row.storeName
                            : 'N/A'}
                      </td>
                      <td className='p-2'>{row.UUID}</td>
                      <td className='p-2'>
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusStyles[row.status] || 'bg-gray-100 text-gray-600 border-gray-300'}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className='p-2'>{row.role}</td>
                      <td className='p-2'>
                        <ActionPopUp
                          row={row}
                          onOpenRoleModal={openRoleModal}
                          onOpenUserModal={openUserModal}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                    </React.Fragment>
                  ))
                  }
                </tbody>
              </table>
            </motion.div>
            <motion.div 
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.95}}
              transition={{ duration: 0.3 }}
              className='cardUser-view'>
                <div className='rounded-md grid grid-cols-1 gap-3 w-full'>
                  {fiteredUsers.map((user) => {
                    return (
                      <div 
                        key={user._id}
                        className='shadow-sm rounded-md p-2'
                        >
                          <div className='flex items-center gap-3'>
                            <h1 className='font-semibold uppercase bg-orange-400 p-3 text-lg text-white rounded-md'>
                              {
                                (user.username !== 'None' && user.username
                                  ? user.username
                                  : user.storeName !== 'None' && user.storeName
                                    ? user.storeName
                                    : 'N/A').slice(0,2)
                              }
                            </h1>

                            <div className='flex flex-col gap-2 w-full'>
                              <div className='flex items-center justify-between flex-wrap'>
                                <p className='text-gray-500'>
                                  <span className=''>{user?.UUID}</span>
                                </p>
                                <div className=''>
                                  <span 
                                    className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusStyles[user?.status] || 'bg-gray-100 text-gray-600 border-gray-300'}`}
                                    >
                                    {user?.status}
                                  </span>
                                </div>
                              </div>
                              <p className='text-orange-400'>
                                {user?.role}
                              </p>
                              <p className='text-gray-500'>
                                User: {
                                  user.username !== 'None' && user.username
                                    ? user.username
                                    : user.storeName !== 'None' && user.storeName
                                      ? user.storeName
                                      : 'N/A'
                                }
                              </p>

                              <div className='flex items-center justify-between'>
                                <GrFormViewHide 
                                  onClick={() => openUserModal(user)}
                                  className='cursor-pointer text-primary hover:text-orange-400 venProdIcon4u' 
                                  size={20} 
                                />
                                <TbEdit 
                                  onClick={() => openRoleModal(user)}
                                  className='cursor-pointer text-primary hover:text-orange-400 venProdIcon4u' 
                                  size={20} 
                                />
                                <IoTrashOutline 
                                  onClick={() => handleDelete(user._id)}
                                  className='cursor-pointer text-primary hover:text-red-500 venProdIcon4u' 
                                  size={20} 
                                />
                              </div>
                            </div>                           
                          </div>
                      </div>
                    )
                  })}
                </div>
            </motion.div>

            
            <div className='flex justify-between items-center mt-4 gap-2 navigator'>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className='px-3 py-1 border rounded disabled:opacity-50 cursor-pointer'>
                    Prev
                  </button>
                  <span className='text-sm'>
                    Page {page} of {pages}
                  </span>
                  <button 
                    disabled={page === pages}
                    onClick={() => setPage(page + 1 )}
                    className='px-3 py-1 border rounded disabled:opacity-50 cursor-pointer'
                    >
                      Next
                  </button>
              </div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Users