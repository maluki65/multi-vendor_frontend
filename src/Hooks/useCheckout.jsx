import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Api } from '../utils';

const useCheckout = (sessionId) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const prepareCheckout = useMutation({
    mutationFn: async ({ location }) => {
      const { data } = await Api.post('/checkout/prepare', {
        county: location?.county,
        area: location?.area,
      });

      return data;
    },

    onMutate: () => {
      const toastId = toast.loading('Preparing checkout...');
      return { toastId };
    },

    onSuccess: async (data, _, context) => {
      toast.success('Checkout ready', { id: context.toastId });

      const sessionId = data.checkout.id;

      const res = await Api.get(`/checkout/session/${sessionId}`);

      const fullSession = res.data.session;

      queryClient.setQueryData(['checkout', sessionId], fullSession);

      navigate(`/buyer/checkout/${sessionId}`);
    },

    onError: (error, _, context) => {
      toast.error(
        error?.response?.data?.message || 'Checkout failed', { id: context.toastId }
      );

      console.error('Failed to prepare checkout', error);
    },
  });

  const checkoutSessionQuery = useQuery({
    queryKey: ['checkout', sessionId],
    queryFn: async () => {
      const { data } = await Api.get(`/checkout/session/${sessionId}`);
      return data.session;
    },
    enabled: !!sessionId,
  });

  const getAllCheckoutSessions = useQuery({
    queryKey: ['checkoutSessions'],
    queryFn: async () => {
      const { data } = await Api.get('/checkout/sessions');
      return data.sessions;
    },
  });

  const resumeCheckout = useMutation({
    mutationFn: async (sessionId) => {
      const { data } = await Api.patch(`/checkout/resume/${sessionId}`);
      return data.session;
    },

    onMutate: () => {
      const toastId = toast.loading('resuming checkout session...');
      return { toastId };
    },

    onSuccess: async(session, _, context) => {
      toast.success('Checkout session resumed', { id: context.toastId });

      queryClient.setQueryData(['checkoutSessions', session._id], session);

      await queryClient.invalidateQueries({
        queryKey: ['checkoutSessions'],
      });

      navigate(`/buyer/checkout/${session._id}`);
    },

    onError: (error, _, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to resume checkout session', { id: context.toastId }
      );

      console.error('Failed to resume checkout session', error);
    },
  });

  const completeCheckout = useMutation({
    mutationFn: async (sessionId) => {
      const { data } = await Api.post(`/checkout/completed/${sessionId}`);
      return data;
    },

    onMutate: () => {
      const toastId = toast.loading('Processing payment...');
      return { toastId }
    },

    onSuccess: async (data, sessionId, context) => {
      toast.success('Payment successful...Order created!', { id: context.toastId });

      await queryClient.invalidateQueries({
        queryKey: ['Orders'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['cart'],
      });

      //navigate('/buyer/account');
    },

    onError: (error, _, context) => {
      toast.error(
        error?.response?.data?.message || 'Payment failed',
        { id: context.toastId }
      );

      console.error('Payment failed', error);
    },
  });

  const updateShipping = useMutation({
    mutationFn: async ({ sessionId, county, area }) => {
      const { data } = await Api.patch(`/checkout/shipping/${sessionId}`, {
          county,
          area,
        })
      return data;
    },

    onMutate: () => {
      const toastId = toast.loading('Updating shipping...');
      return { toastId }
    },

    onSuccess: (data, sessionId, context) => {
      toast.success('Shipping updated', { id: context.toastId });

      queryClient.invalidateQueries({
        queryKey: ['checkout', sessionId],
      });
    },

    onError: (error, _, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to update shipping',
        { id: context.toastId }
      );

      console.error('Failed to update shipping', error);
    },
  })

  return {
    isPending: prepareCheckout.isPending, 
    
    prepareCheckout,
    checkoutSessionQuery,
    getAllCheckoutSessions,
    resumeCheckout,
    updateShipping,
    completeCheckout,
  };
};

export default useCheckout;