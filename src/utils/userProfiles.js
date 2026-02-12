export const getUserProfileByRole = (user) => {
  if (!user) return null;

  if (user.role === 'Vendor') return user.vendorProfile;
  if (user.role === 'Buyer') return user.buyerProfile;

  return null;
};

export const needsProfile = (user) => {
  if (!user) return false;

  if (user.role === 'Admin') return false;

  if (user.role === 'Vendor' && user.status !== 'approved'){
    return false;
  }

  const profile = getUserProfileByRole(user);

  return !profile;
};