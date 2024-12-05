import axios from '../../axios'

export const getProducts = (params) => {
   return axios({
      url: '/product/get-all',
      method: 'GET',
      params,
   })
}
export const getProduct = (pid) => {
   return axios({
      url: '/product/get/' + pid,
      method: 'GET',
   })
}
export const apiRating = (data) => {
   return axios({
      url: '/product/ratings',
      method: 'PUT',
      data
   })
}