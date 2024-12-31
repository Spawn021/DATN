import path from './path'
import icons from './icons'
const { FaHome, FaTty, FaReply, FaTruck, FaGift, FaShieldAlt, RxDashboard, FaUserGroup, FaProductHunt, FaFileInvoiceDollar, BsFillPersonFill, GiPositionMarker, MdHistory, FaLock } = icons
export const navigation = [
   {
      id: 1,
      value: 'HOME',
      path: `${path.HOME}`,
   },
   {
      id: 2,
      value: 'PRODUCTS',
      path: `${path.PRODUCTS}`,
   },
   {
      id: 3,
      value: 'BLOGS',
      path: `${path.BLOGS}`,
   },
   {
      id: 4,
      value: 'OUR SERVICES',
      path: `${path.OUR_SERVICES}`,
   },
   {
      id: 5,
      value: 'FAQS',
      path: `${path.FAQS}`,
   },
]
export const ProductExtraInfoData = [
   {
      id: 1,
      title: 'Guarantee',
      content: 'Quality Checked',
      icon: <FaShieldAlt />,
   },
   {
      id: 2,
      title: 'Free Shipping',
      content: 'Free On All Products',
      icon: <FaTruck />,
   },
   {
      id: 3,
      title: 'Special Gift Cards',
      content: 'Special Gift Cards',
      icon: <FaGift />,
   },
   {
      id: 4,
      title: 'Free Return',
      content: 'Within 7 Days',
      icon: <FaReply />,
   },
   {
      id: 5,
      title: 'Consultancy',
      content: 'Lifetime 24/7/356',
      icon: <FaTty />,
   },
]
export const productDescriptionTabs = [
   {
      id: 1,
      name: 'DESCRIPTION',
      content: `Technology: GSM / HSPA / LTE
               Dimensions: 144.6 x 69.2 x 7.3 mm
               Weight: 129 g
               Display: IPS LCD 5.15 inches
               Resolution: 1080 x 1920
               OS: Android OS, v6.0 (Marshmallow)
               Chipset: Snapdragon 820
               CPU: Quad-core
               Internal: 32GB/64GB/128GB
               Camera: 16 MP, f/2.0 - 4 MP, f/2.0`,
   },
   {
      id: 2,
      name: 'WARRANTY',
      content: `LIMITED WARRANTIES
               Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:
               Frames Used In Upholstered and Leather Products
               Limited Lifetime Warranty
               A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
   },
   {
      id: 3,
      name: 'DELIVERY',
      content: `Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
Picking up at the store
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
   },
   {
      id: 4,
      name: 'PAYMENT',
      content: `
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
   },
]
export const colors = ['black', 'brown', 'gray', 'green', 'blue', 'yellow', 'purple', 'orange', 'gray', 'brown']
export const options = [
   { id: 1, value: '-sold', label: 'Best Selling' },
   { id: 2, value: 'price', label: 'Price: Low to High' },
   { id: 3, value: '-price', label: 'Price: High to Low' },
   { id: 4, value: 'createAt', label: 'Oldest' },
   { id: 5, value: '-createdAt', label: 'Newest' },
   { id: 6, value: 'title', label: 'Alphabetically, A-Z' },
   { id: 7, value: '-title', label: 'Alphabetically, Z-A' },
]
export const voteOptions = [
   { id: 1, value: 'Very Bad' },
   { id: 2, value: 'Bad' },
   { id: 3, value: 'Good' },
   { id: 4, value: 'Very Good' },
   { id: 5, value: 'Excellent' },
]
export const adminSidebar = [
   {
      id: 1,
      type: 'single',
      value: 'Dashboard',
      path: `/${path.ADMIN}/${path.DASHBOARD}`,
      icon: <RxDashboard />,
   },
   {
      id: 2,
      type: 'single',
      value: 'Users',
      path: `/${path.ADMIN}/${path.MANAGE_USERS}`,
      icon: <FaUserGroup />,
   },
   {
      id: 3,
      type: 'parent',
      value: 'Products',
      icon: <FaProductHunt />,
      children: [
         {
            value: 'Manage Products',
            path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
         },
         {
            value: 'Create Product',
            path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
         }
      ],
   },
   {
      id: 4,
      type: 'single',
      value: 'Orders',
      path: `/${path.ADMIN}/${path.MANAGE_ORDERS}`,
      icon: <FaFileInvoiceDollar />,
   },
]

export const memberSidebar = [
   {
      id: 1,
      type: 'single',
      value: 'Personal',
      path: `/${path.MEMBER}/${path.PERSONAL}`,
      icon: <BsFillPersonFill />,
   },
   {
      id: 2,
      type: 'single',
      value: 'My Address',
      path: `/${path.MEMBER}/${path.MY_ADDRESS}`,
      icon: <GiPositionMarker />,
   },
   {
      id: 3,
      type: 'single',
      value: 'Change Password',
      path: `/${path.MEMBER}/${path.CHANGE_PASSWORD}`,
      icon: <FaLock />,
   },
   {
      id: 4,
      type: 'single',
      value: 'History',
      path: `/${path.MEMBER}/${path.HISTORY}`,
      icon: <MdHistory />,
   },
   {
      id: 5,
      type: 'single',
      value: 'Go Home',
      path: `/${path.HOME}`,
      icon: <FaHome />,
   }

]
export const roles = [
   { id: 'user', value: 'User' },
   { id: 'admin', value: 'Admin' },
]
export const userStatus = [
   { id: false, value: 'Active' },
   { id: true, value: 'Blocked' },
]