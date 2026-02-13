import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";
import toast from 'react-hot-toast';
import { Api } from "../utils";

const useVerification = () => {
  const { data: me } = useCurrentUser();
  const queryClient = useQueryClient();

  // On vendor actions
   //:on getting verification info
  const getMyVerification = useQuery({
    queryKey: ['myVerification'],
    queryFn: async () => {
      const { data } = await Api.get('/vendor/verification/me');
      return data.verification;
    },
    staleTime: 1000 * 60,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to get verification info!');
      console.error('Failed to get verification info!', error);
    },
  });

   //: on posting verification info
  const submitVerification = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.post('/vendor/verification', payload);
      return data;
    },
    onMutate: () => {
      const id = toast.loading('submitting verification info...');
      return { toastId: id };
    },
    onSuccess: (data, variables, context) => {
      toast.success('Verification submitted successfully', { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ['myVerification'] });
    },
    onError: (error, variables, context) => {
      toast.error(error?.response?.data?.message || 'Failed to submit verification info!', { id: context.toastId });
      console.error('Failed to submit verification info!', error);
    },
  });

   //: on resubmitting in status: 'rejected'
  const resubmitVerification = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.patch('/vendor/verification/resubmit', payload);
      return data;
    },
    onMutate: () => {
      const id = toast.loading('Resubmitting verification info...');
      return { toastId: id };
    },
    onSuccess: (data, variables, context) => {
      toast.success('Verification resubmitted successfully', { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ['myVerification'] });
    },
    onError: (error, variables, context) => {
      toast.error(error?.response?.data?.message || 'Failed to resubmit verification info!', { id: context.toastId });
      console.error('Failed to resubmit verification info!', error);
    },
  });

  //On Admin Actions
    //:on getting all verifications
  const getAllVerifications = useQuery({
    queryKey: ['allVerifications'],
    queryFn: async () => {
      const { data } = await Api.get('/admin/verification/all');
      return data.verifications;
    },
    enabled: me?.role === 'Admin',
    staleTime: 1000 * 60,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to get verifications');
      console.error('Failed to get all verification', error);
    },
  });

   //: on updating rejection status
  /*const updateVerificationStatus = useMutation(
    async ({ userId, status, rejectionReason }) => {
      const { data } = await Api.post('/admin/verification', { userId, status, rejectionReason });
      return data;
    },
    {
      onSuccess: () => {
        toast.success('Verification status updated successfully');
        queryClient.invalidateQueries(['allVerifications']); 
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to update verification status');
      },
    }
  );*/

  return {
    getMyVerification,
    submitVerification,
    resubmitVerification,

    getAllVerifications,
    //updateVerificationStatus,
  };
};

export default useVerification;