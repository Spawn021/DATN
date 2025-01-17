const path = {
   PUBLIC: '/',
   HOME: '',
   ALL: '*',
   LOGIN: 'login',
   PRODUCTS__CATEGORY: ':category',
   PRODUCTS: 'products',
   BLOGS: 'blog',
   OUR_SERVICES: 'our-services',
   FAQS: 'faqs',
   DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
   DETAIL_BLOG__CATEGORY__BID__TITLE: 'blog/:bid/:title',
   ACTIVE_REGISTER: 'active-account/:status',
   FORGET_PASSWORD: 'forget-password',
   DETAIL_CART: 'cart-detail',
   WISHLIST: 'wishlist',
   CHECKOUT: 'checkout',
   PAYMENT: 'payment',

   // Admin
   ADMIN: 'admin',
   DASHBOARD: 'dashboard',
   MANAGE_USERS: 'manage-users',
   MANAGE_PRODUCTS: 'manage-products',
   MANAGE_ORDERS: 'manage-orders',
   CREATE_PRODUCT: 'create-product',
   MANAGE_COUPONS: 'manage-coupons',
   MANAGE_BLOGS: 'manage-blogs',
   CREATE_BLOG: 'create-blog',
   MANAGE_BLOG_CATEGORIES: 'manage-blog-categories',

   //Member
   MEMBER: 'member',
   PERSONAL: 'personal',
   HISTORY: 'history',
   CHANGE_PASSWORD: 'change-password',
   MY_ADDRESS: 'my-address',

}
export default path
