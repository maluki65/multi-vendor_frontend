import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";
import toast from 'react-hot-toast';
import { Api } from "../utils";

const useKyc = () => {
  const { data: me } = useCurrentUser();
  const queryClient = useQueryClient();

  // On vendor actions
   //:on getting kyc info
  const getMykyc = useQuery({
    queryKey: ['myKyc'],
    queryFn: async () => {
      const { data } = await Api.get('/vendor/kyc/me');
      return data?.kyc ?? null;
    },
    staleTime: 1000 * 60,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to get kyc info!');
      console.error('Failed to get kyc info!', error);
    },
  });

   //: on posting kyc info
  const submitKyc = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.post('/vendor/kyc', payload);
      return data;
    },
    /*onMutate: () => {
      const id = toast.loading('submitting kyc info...');
      return { toastId: id };
    },*/
    onSuccess: (data, variables, context) => {
      /*toast.success('kyc submitted successfully', { id: context.toastId });*/
      queryClient.invalidateQueries({ queryKey: ['myKyc'] });
    },
    onError: (error, variables, context) => {
      /*toast.error(error?.response?.data?.message || 'Failed to submit kyc info!', { id: context.toastId });*/
      console.error('Failed to submit kyc info!', error);
    },
  });

   //: on resubmitting in status: 'rejected'
  const resubmitKyc = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.patch('/vendor/kyc/resubmit', payload);
      return data;
    },
    onMutate: () => {
      const id = toast.loading('Resubmitting kyc info...');
      return { toastId: id };
    },
    onSuccess: (data, variables, context) => {
      toast.success('kyc resubmitted successfully', { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ['myKyc'] });
    },
    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to resubmit kyc info!', 
        { id: context.toastId }
      );
    },
  });

  //On Admin Actions
    //:on getting all kyc(s)
  const getAllKyc = useQuery({
    queryKey: ['allKyc'],
    queryFn: async () => {
      const { data } = await Api.get('/admin/kyc/all');
      return data.kycs;
    },
    enabled: me?.role === 'Admin',
    staleTime: 1000 * 60,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to get kyc(s)');
      console.error('Failed to get all kyc(s)', error);
    },
  });

  //: on getting kyc by id
  const getKycByUserId = (userId) => useQuery({
    queryKey: ['vendorKyc', userId],
    queryFn: async () => {
      const { data } = await Api.get(`/admin/kyc/${userId}`);
      return data.kyc;
    },
    enabled: !!userId && me?.role === 'Admin',
    staleTime: 1000 * 60,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to get vendor kyc');
      console.error('Failed to fetch vendor kyc', error);
    },
  });

   //: on updating rejection status
  /*const updateKycStatus = useMutation(
    async ({ userId, status, rejectionReason }) => {
      const { data } = await Api.post('/admin/kyc', { userId, status, rejectionReason });
      return data;
    },
    {
      onSuccess: () => {
        toast.success('kyc status updated successfully');
        queryClient.invalidateQueries(['allVerifications']); 
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to update kyc status');
      },
    }
  );*/

  return {
    getMykyc,
    submitKyc,
    resubmitKyc,

    getAllKyc,
    getKycByUserId,
    //updateKycStatus,
  };
};

export default useKyc;