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
export const createProduct = (data) => axios({
   url: '/product/create',
   method: 'POST',
   data
})
export const updateProduct = (data, pid) => axios({
   url: '/product/update/' + pid,
   method: 'PUT',
   data
})
export const deleteProduct = (pid) => axios({
   url: '/product/delete/' + pid,
   method: 'DELETE',
})
export const addVariants = (data, pid) => axios({
   url: '/product/variant/' + pid,
   method: 'PUT',
   data
})