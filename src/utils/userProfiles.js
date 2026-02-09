export const getUserProfileByRole = (user) => {
  if (!user) return null;

  if (user.role === 'Vendor') return user.vendorProfile;
  if (user.role === 'Buyer') return user.buyerProfile;

  return null;
};

export const needsProfile = (user) => {
  const profile = getUserProfileByRole(user);
  return user.role !== 'Admin' && !profile;
};