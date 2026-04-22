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
      return toastId;
    },

    onSuccess: (session) => {
      queryClient.setQueryData(['checkoutSessions', session._id], session);
      navigate(`/buyer/checkout/${session._id}`);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Failed to resume checkout session'
      );

      console.error('Failed to resume checkout session', error);
    },
  });

  return {
    isPending: prepareCheckout.isPending, 
    
    prepareCheckout,
    checkoutSessionQuery,
    getAllCheckoutSessions,
    resumeCheckout,
  };
};

export default useCheckout;