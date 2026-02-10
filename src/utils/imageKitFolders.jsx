export const PROFILE_FOLDERS = {
  Admin: import.meta.env.VITE_IMAGEKIT_ADMINPROFILE,
  Buyer: import.meta.env.VITE_IMAGEKIT_BUYERPROFILE,
  Vendor: import.meta.env.VITE_IMAGEKIT_VENDORPROFILE,
};

export const getProfileFolderByRole = (role) => {
  return PROFILE_FOLDERS[role] || PROFILE_FOLDERS.Buyer;
}