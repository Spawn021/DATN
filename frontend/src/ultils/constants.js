import path from './path'
import icons from './icons'
const {
   FaHome,
   FaTty,
   FaReply,
   FaTruck,
   FaGift,
   FaShieldAlt,
   RxDashboard,
   FaUserGroup,
   FaProductHunt,
   FaFileInvoiceDollar,
   BsFillPersonFill,
   GiPositionMarker,
   MdHistory,
   FaLock,
   FaBlogger } = icons
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
   }
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
   {
      id: 5,
      type: 'single',
      value: 'Counpons',
      path: `/${path.ADMIN}/${path.MANAGE_COUPONS}`,
      icon: <FaGift />,
   },
   {
      id: 6,
      type: 'parent',
      value: 'Blogs',
      icon: <FaBlogger />,
      children: [
         {
            value: 'Manage Blogs',
            path: `/${path.ADMIN}/${path.MANAGE_BLOGS}`,
         },
         {
            value: 'Create Blog',
            path: `/${path.ADMIN}/${path.CREATE_BLOG}`,
         },
         {
            value: 'Blog Categories',
            path: `/${path.ADMIN}/${path.MANAGE_BLOG_CATEGORIES}`,
         }
      ],
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
export const orderStatus = [
   { label: 'Pending', value: 'Pending' },
   { label: 'Processing', value: 'Processing' },
   { label: 'Completed', value: 'Completed' },
   { label: 'Cancelled', value: 'Cancelled' },
]
export const orderStatusAdmin = [
   { id: 'Pending', value: 'Pending' },
   { id: 'Processing', value: 'Processing' },
   { id: 'Completed', value: 'Completed' },
   { id: 'Cancelled', value: 'Cancelled' },
]
export const couponStatus = [
   { id: true, value: 'Active' },
   { id: false, value: 'Inactive' },
]
export const couponType = [
   { id: 'fixed', value: 'Fixed' },
   { id: 'percentage', value: 'Percentage' },
]
export const faqData = [
   {
      id: 1,
      question: 'How can I place an order?',
      answer: 'You can place an order directly on our website or contact us via our hotline for assistance.',
   },
   {
      id: 2,
      question: 'What are the payment methods available?',
      answer: 'We accept various payment methods, including credit/debit cards, PayPal, and bank transfers.',
   },
   {
      id: 3,
      question: 'How long does shipping take?',
      answer: 'Shipping usually takes 3-5 business days, depending on your location.',
   },
   {
      id: 4,
      question: 'Can I return or exchange a product?',
      answer: 'Yes, you can return or exchange a product within 7 days of receiving it, provided it is in its original condition.',
   },
   {
      id: 5,
      question: 'Do you offer international shipping?',
      answer: 'Yes, we offer international shipping. Additional fees and delivery times may apply depending on the destination.',
   },
   {
      id: 6,
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email. You can use this number to track your order on our website or the courier\'s website.',
   },
];
