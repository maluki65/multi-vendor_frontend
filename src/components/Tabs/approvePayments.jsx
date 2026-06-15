import toast from 'react-hot-toast';

const usePaymentApprove = () => {
  const confirmApproval = ({ onApprove, vendor }) => {
    toast((t) => (
      <span className='flex flex-col gap-2 text-sm'>
        Are you sure you want to approve payment for {vendor}?
        <div className='flex justify-end gap-2 mt-1'>
          <button
            className='px-3 cursor-pointer py-1 text-white bg-red-600 rounded-md hover:bg-red-700'
            onClick={() => {
              toast.dismiss(t.id);
              onApprove();
            }}
            >
              Yes
          </button>
  
          <button 
            className='px-3 cursor-pointer py-1 bg-gray-300 rounded-md hover:bg-gray-400'
            onClick={() => toast.dismiss(t.id)}
            >
              Cancel
          </button>
        </div>
      </span>
    ));
  };

  return confirmApproval;
};

export default usePaymentApprove;
