import { useQuery } from '@tanstack/react-query';
import { Api } from '../utils';

const useAnalytics = (role) => {
  const getVendorAnalytics = useQuery({
    queryKey: ['vendor-analytics'],
    enabled: role === 'Vendor',
    queryFn: async () => {
      const { data } = await Api.get('/vendor/dashboard/analytics');
      return data.analytics;
    },
  })

  const getAdminAnalytics = useQuery({
    queryKey: ['admin-analytics'],
    enabled: role === 'Admin',
    queryFn: async () => {
      const { data } = await Api.get('/admin/dashboard/analytics');
      return data.analytics;
    }
  })

  return {
    getVendorAnalytics,
    getAdminAnalytics,
  }
}

export default useAnalytics;