import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Api } from '../utils';

const useWallet = (role) => {
  const queryClient = useQueryClient();

  // On getting wallet
  const getWallet = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data } = await Api.get('/wallet');
      return data;
    },
    staleTime: 1000 * 60 * 10,
    enabled: role === 'Vendor',
  });

  // On getting vendor wallet transactions
  const getVendorWalletTransactions = useQuery({
    queryKey: ['Vendor-WalletTransactions'],
    queryFn: async () => {
      const { data } = await Api.get('/wallet/transactions');
      return data;
    },

    enabled: role === 'Vendor',
    staleTime: 1000 * 60 * 10,
  });

  // On getting vendor withdrawal requests
  const getWithdrawalHistory = (page = 1, limit = 20 ) => { 
    return useQuery({
      queryKey: ['vendor-withdrawals', page, limit],
      queryFn: async () => {
        const { data } = await Api.get(`/wallet/withdrawals/history?page=${page}&limit=${limit}`);
        return data;
      },
      enabled: role === 'Vendor',
      staleTime: 1000 * 60 * 10,
    });
  }

  // On getting all pending withdrawal requests for admin
  const getPendingWithdrawalRequests = (page = 1, limit = 10, search = '', sort = 'latest') => { 
      return useQuery({
      queryKey: ['admin-withdrawalsRequests', page, limit, search, sort],
      queryFn: async () => {
        const { data } = await Api.get(`/wallet/pending/withdrawals?page=${page}&limit=${limit}&search=${search}&sort=${sort}`);
        
        return data;
      },
      enabled: role === 'Admin',
      staleTime: 1000 * 60 * 10,
    });
  };

  // On requesting withdrawal
  const requestWithdrawal = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.post('/wallet/withdrawal', payload);
      return data;
    },

    onMutate: () => {
      const toastId = toast.loading('Requesting withdrawal...');
      return { toastId };
    },

    onSuccess: (data, variables, context) => {
      toast.success('Withdrawal request submitted', { id: context.toastId});

      queryClient.invalidateQueries({
        queryKey: ['vendor-withdrawals']
      });

      queryClient.invalidateQueries({
        queryKey: ['wallet']
      });

      queryClient.invalidateQueries({
        queryKey: ['Vendor-WalletTransactions']
      });
    },

    onError: (error, variables, context) => {
      toast.error(error?.response?.data?.message || 'failed to request withdrawal. Try again later', { id: context.toastId})

      console.error('failed to request withdrawal', error);
    }
  });

  // On approving withdrawal requests
  const approveWithdrawalRequest = useMutation({
    mutationFn: async ({ withdrawalId, adminNotes }) => {
      const { data } = await Api.patch(`/wallet/approve/withdrawal/${withdrawalId}`, { adminNotes });
      return data;
    },

    onMutate: () => {
      const toastId = toast.loading('Approving payment...');
      return { toastId };
    },

    onSuccess: (data, variables, context) => {
      toast.success('Request approved and payment made', { id: context.toastId});

      queryClient.invalidateQueries({
        queryKey: ['admin-withdrawalsRequests'],
      });

      queryClient.invalidateQueries({
        queryKey: ['wallet'],
      });

      queryClient.invalidateQueries({
        queryKey: ['Vendor-WalletTransactions']
      });
    },

    onError: (error, variables, context) => {
      toast.error(error?.response?.data?.message || 'failed to approve withdrawal. Try again later', { id: context.toastId})

      console.error('failed to approve withdrawal request', error);
    }
  });

  // On rejecting withdrawal requests
  const rejectWithdrawalRequest = useMutation({
    mutationFn: async ({ withdrawalId, rejectionReason }) => {
      const { data } = await Api.patch(`/wallet/reject/withdrawal/${withdrawalId}`, { rejectionReason });
      return data;
    },

    onMutate: () => {
      const toastId = toast.loading('Rejecting withdrawal request...');
      return { toastId };
    },

    onSuccess: (data, variables, context) => {
      toast.success('Withdrawal request rejected', { id: context.toastId});

      queryClient.invalidateQueries({
        queryKey: ['admin-withdrawalsRequests'],
      });

      queryClient.invalidateQueries({
        queryKey: ['wallet'],
      });

      queryClient.invalidateQueries({
        queryKey: ['Vendor-WalletTransactions']
      });
    },

    onError: (error, variables, context) => {
      toast.error(error?.response?.data?.message || 'failed to reject withdrawal. Try again later', { id: context.toastId})

      console.error('failed to reject withdrawal request', error);
    }
  });

  return {
    getWallet,
    getWithdrawalHistory,
    getVendorWalletTransactions,
    getPendingWithdrawalRequests,

    requestWithdrawal,
    approveWithdrawalRequest,
    rejectWithdrawalRequest,
  }
}

export default useWallet;