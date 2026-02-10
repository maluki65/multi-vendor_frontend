import { CreateBuyerProfile, CreateVendorProfile } from "../components";

export const getProfileFormByRole = (role) => {
  const forms = {
    Vendor: CreateVendorProfile,
    Buyer: CreateBuyerProfile,
  };

  return forms[role] || null;
}