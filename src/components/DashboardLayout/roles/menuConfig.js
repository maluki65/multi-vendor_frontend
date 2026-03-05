import { MdOutlineAdminPanelSettings, MdOutlinePayments, MdOutlineDomainVerification } from "react-icons/md";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { HiOutlinePlusCircle } from "react-icons/hi2";
import { RiShoppingCartLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { LuUsers } from "react-icons/lu";

export const menuRoleItems = {
  Admin: [
    { label: 'Dashboard', value: 'overview', icon: RxDashboard, link: "?tab=overview" },
    { label: 'Add admin', value: 'Add-admin', icon: MdOutlineAdminPanelSettings, link: "?tab=add-admin" },
    { label: 'Users', value: 'Users', icon: LuUsers, link: "?tab=users" },
    { label: 'Approvals', value: 'Approvals', icon: IoCheckmarkDoneCircleOutline, link: "?tab=approvals" },
    { label: 'Orders', value: 'Orders', icon: RiShoppingCartLine, link: "?tab=orders" },
    { label: 'Payments', value: 'Payments', icon: MdOutlinePayments, link: '?tab=payments'},
    //{ label: 'Profile', value: 'Profile', icon: CgProfile, link: "?tab=profile"},
    { label: 'Settings', value: 'Settings', icon: IoSettingsOutline, link: "?tab=settings"},
  ],

  Vendor: [
    { label: 'Dashboard', value: 'overview', icon: RxDashboard, link: "?tab=overview" },
    { label: 'Add Product', value: 'Add-Product', icon: HiOutlinePlusCircle, link: '?tab=addProduct'},
    { label: 'Orders', value: 'orders', icon: RiShoppingCartLine, requiresApproval: true, link: "?tab=orders" },
    { label: 'Payments', value: 'payments', icon: MdOutlinePayments, requiresApproval: true, link: "?tab=payments" },
    { label: 'Verification', value: 'verification', icon: MdOutlineDomainVerification, requiresApproval: true, link: "?tab=verification" },
    { label: 'Settings', value: 'Settings', icon: IoSettingsOutline, link: "?tab=settings"},
  ],
  Buyer:[]
}