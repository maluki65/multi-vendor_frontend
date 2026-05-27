import { MdOutlineAdminPanelSettings, MdOutlinePayments, MdOutlineDomainVerification } from "react-icons/md";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { HiOutlinePlusCircle } from "react-icons/hi2";
import { RiShoppingCartLine, RiBox2Line, RiCheckboxMultipleBlankFill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { LuUsers } from "react-icons/lu";
import { CiUser, CiHeart } from "react-icons/ci";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { GoHeart } from "react-icons/go";

export const menuRoleItems = {
  Admin: [
    { label: 'Dashboard', value: 'overview', icon: RxDashboard, link: "?tab=overview" },
    { label: 'Add admin', value: 'Add-admin', icon: MdOutlineAdminPanelSettings, link: "?tab=add-admin" },
    { label: 'Users', value: 'Users', icon: LuUsers, link: "?tab=users" },
    { label: 'Approvals', value: 'Approvals', icon: IoCheckmarkDoneCircleOutline, link: "?tab=approvals" },
    { label: 'Products', value: 'product-approval', icon: RiCheckboxMultipleBlankFill, link: "?tab=product-approvals" },
    { label: 'Orders', value: 'orders', icon: RiShoppingCartLine, requiresApproval: true, link: "?tab=orders" },
    { label: 'Payments', value: 'Payments', icon: MdOutlinePayments, link: '?tab=payments'},
    //{ label: 'Profile', value: 'Profile', icon: CgProfile, link: "?tab=profile"},
    { label: 'Settings', value: 'AdminSettings', icon: IoSettingsOutline, link: "?tab=settings"},
  ],

  Vendor: [
    { label: 'Dashboard', value: 'overview', icon: RxDashboard, link: "?tab=overview" },
    { label: 'Add Product', value: 'Add-Product', icon: HiOutlinePlusCircle, link: '?tab=addProduct'},
    { label: 'Products', value: 'products', icon: FiShoppingBag, link: '?tab=myproducts'},
    { label: 'Orders', value: 'orders', icon: RiShoppingCartLine, requiresApproval: true, link: "?tab=orders" },
    { label: 'Payments', value: 'payments', icon: MdOutlinePayments, requiresApproval: true, link: "?tab=payments" },
    { label: 'Verification', value: 'verification', icon: MdOutlineDomainVerification, requiresApproval: true, link: "?tab=verification" },
    { label: 'Settings', value: 'vendorSettings', icon: IoSettingsOutline, link: "?tab=settings"},
  ],
 Buyer: [
  //{ label: 'Dashboard', value: 'dashboard', icon: RiShoppingBagLine, link: '/dashboard' },
  //{ label: 'Profile', value: 'profile', icon: CiUser, link: '/profile' },
  { label: 'Wishlist', value: 'wishlist', icon: GoHeart, link: '/wishlist' },
  { label: 'Cart', value: 'cart', icon: LiaShoppingCartSolid, link: '/cart' },
]
}