import { CreateBuyerProfile, CreateVendorProfile, CreateAdminForm } from "../components";

export const getProfileFormByRole = (role) => {
  const forms = {
    Admin: CreateAdminForm,
    Vendor: CreateVendorProfile,
    Buyer: CreateBuyerProfile,
  };

  return forms[role] || null;
}