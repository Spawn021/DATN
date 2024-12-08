const path = {
   PUBLIC: '/',
   HOME: '',
   ALL: '*',
   LOGIN: 'login',
   PRODUCTS: ':category',
   BLOGS: 'blogs',
   OUR_SERVICES: 'our-services',
   FAQS: 'faqs',
   DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
   ACTIVE_REGISTER: 'active-account/:status',
   FORGET_PASSWORD: 'forget-password',

   // Admin
   ADMIN: 'admin',
   DASHBOARD: 'dashboard',
   MANAGE_USERS: 'manage-users',
   MANAGE_PRODUCTS: 'manage-products',
   MANAGE_ORDERS: 'manage-orders',
   CREATE_PRODUCT: 'create-product',

   //Member
   MEMBER: 'member',
   PERSONAL: 'personal',

}
export default path
