import axios from '../../axios'
export const getProductCategories = () =>
   axios({
      url: '/product-category/get-all',
      method: 'GET',
   })
