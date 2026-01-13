import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
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
    //{ label: 'Profile', value: 'Profile', icon: CgProfile, link: "?tab=profile"},
    { label: 'Settings', value: 'Settings', icon: IoSettingsOutline, link: "?tab=settings"},
  ],
  Vendor: [],
  Buyer:[]
}