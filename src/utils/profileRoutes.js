export const PROFILE_ROUTES = {
  Admin: null,
  Vendor:'/vendor/profile',
  Buyer:'/buyer/profile',
};

export const getProfileRouteByRole =  (role) => {
  return PROFILE_ROUTES[role] || PROFILE_ROUTES.Buyer;
};