const path = {
   PUBLIC: '/',
   HOME: '',
   ALL: '*',
   LOGIN: 'login',
   PRODUCTS__CATEGORY: ':category',
   PRODUCTS: 'products',
   BLOGS: 'blogs',
   OUR_SERVICES: 'our-services',
   FAQS: 'faqs',
   DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
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
   CREATE_COUPON: 'create-coupon',

   //Member
   MEMBER: 'member',
   PERSONAL: 'personal',
   HISTORY: 'history',
   CHANGE_PASSWORD: 'change-password',
   MY_ADDRESS: 'my-address',

}
export default path
