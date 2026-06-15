import toast from 'react-hot-toast';
import { Api } from '../../utils';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const handleDeleteUser = (userId) => {
    toast((t) => (
      <span className='flex flex-col gap-2 text-sm'>
        Are you sure you want to delete this user?
      <div className='flex justify-end gap-2 mt-1'>
        <button 
          className='px-3 cursor-pointer py-1 text-white bg-red-600 rounded-md hover:bg-red-700'
          onClick={async() => {
            toast.dismiss(t.id)
            const toastId = toast.loading('Deleting user...', { duration: Infinity });

            try {
              await Api.delete(`/admin/delete/user/${userId}`);

              toast.dismiss(toastId);
              toast.success('User deleted successfully!', { duration: 3000 });

              queryClient.invalidateQueries(['users'])
            } catch(error){
              toast.dismiss(toastId);
              toast.error(error.response?.data?.message || 'User delete failed!');
              console.error('User delete failed:', error);
            }
          }}
        >
          Yes
        </button>

        <button 
          className='px-3 py-1 cursor-pointer bg-gray-300 rounded-md hover:bg-gray-400'
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
      </div>
      </span>
    ));
  };

  return handleDeleteUser;
};

export default useDeleteUser;