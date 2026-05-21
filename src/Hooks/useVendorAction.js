import { useState } from 'react';
import { Api } from '../utils';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const useVendorAction = () => {
  const [loadingIds, setLoadingIds] = useState([]);
  const queryClient = useQueryClient();

  const handleVendorActions = async (vendorId, action, reason = '') => {
    if (!vendorId || !action) return;

    setLoadingIds((prev) => [...prev, vendorId]);
    const toastId = toast.loading(`${action === 'approve' ? 'Approving vendor' : 'Rejecting vendor'}`);

    try {
      const url = action === 'approve'
       ? `/admin/vendor/approve/${vendorId}`
       : `/admin/vendor/reject/${vendorId}`;

      const payload = action === 'reject' ? {reason} : null;

      const  { data } = await Api.put(url, payload);

      toast.success(data.message, { id: toastId });
      setLoadingIds((prev) => prev.filter((id) => id !== vendorId));
      queryClient.invalidateQueries(['pendingVendors']);
      return data;
    } catch (error) {
      console.error('Failed to approve/reject vendor', error);
      toast.error(error.response?.data?.message || 'Something went wrong', { id: toastId });
      setLoadingIds((prev) => prev.filter((id) => id !== vendorId));
    }
  };

  const isLoading = (vendorId) => loadingIds.includes(vendorId);

  return { 
    handleVendorActions, 
    isLoading 
  };
};

export default useVendorAction;