import { useQuery } from '@tanstack/react-query';
import { Api } from '../utils';

const useAnalytics = () => {
  const getVendorAnalytics = useQuery({
    queryKey: ['vendor-analytics'],
    queryFn: async () => {
      const { data } = await Api.get('/vendor/dashboard/analytics');
      return data.analytics;
    }
  })

  return {
    getVendorAnalytics,
  }
}

export default useAnalytics;