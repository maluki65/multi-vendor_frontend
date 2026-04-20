import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Api } from '../utils';

const useCheckout = () => {
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

      navigate('/checkout', {
        state: fullSession,
      });
    },

    onError: (error, _, context) => {
      toast.error(
        error?.response?.data?.message || 'Checkout failed', { id: context.toastId }
      );

      console.error('Failed to prepare checkout', error);
    },
  });

  return {
    isPending: prepareCheckout.isPending, 
    
    prepareCheckout,
  };
};

export default useCheckout;