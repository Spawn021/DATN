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
