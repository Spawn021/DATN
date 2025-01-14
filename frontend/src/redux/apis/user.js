import axios from '../../axios'

export const register = (data) => {
   return axios({
      url: '/user/register',
      method: 'POST',
      data,
      withCredentials: true,
   })
}
export const login = (data) => {
   return axios({
      url: '/user/login',
      method: 'POST',
      data,
      withCredentials: true,
   })
}
export const forgetPassword = (data) => {
   return axios({
      url: '/user/forgot-password',
      method: 'POST',
      data,
   })
}

export const verifyOTP = (data) => {
   return axios({
      url: '/user/verify-otp',
      method: 'POST',
      data,
   })
}
export const resetPassword = (data) => {
   return axios({
      url: '/user/reset-password',
      method: 'PUT',
      data,
   })
}

export const getUserCurrent = () => {
   return axios({
      url: '/user/get-current',
      method: 'GET',
   })
}
export const refreshToken = () => {
   return axios({
      url: '/user/refresh-token',
      method: 'POST',
      withCredentials: true,
   })
}
export const logout = () => {
   return axios({
      url: '/user/logout',
      method: 'POST',
      withCredentials: true,
   })
}
export const getAllUsers = (queries) => {
   return axios({
      url: '/user',
      method: 'GET',
      params: queries,
   })
}
export const updateUser = (uid, data) => {
   return axios({
      url: `/user/${uid}`,
      method: 'PUT',
      data,
   })
}
export const deleteUser = (uid) => {
   return axios({
      url: `/user/${uid}`,
      method: 'DELETE',
   })
}
export const updateCurrent = (data) => {
   return axios({
      url: `/user/update-user`,
      method: 'PUT',
      data,
   })
}
export const changePassword = (data) => {
   return axios({
      url: `/user/change-password`,
      method: 'PUT',
      data,
   })
}
export const updateCart = (data) => {
   return axios({
      url: `/user/cart`,
      method: 'PUT',
      data,
   })
}
export const removeCart = (url) => {
   return axios({
      url: url,
      method: 'DELETE',
   })
}
export const getAddresses = () => {
   return axios({
      url: '/user/get-addresses',
      method: 'GET',
   })
}
export const deleteAddress = (aid) => {
   return axios({
      url: `/user/delete-address/${aid}`,
      method: 'DELETE',
   })
}
export const addAddress = (data) => {
   return axios({
      url: '/user/add-address',
      method: 'POST',
      data,
   })
}
export const updateAddress = (aid, data) => {
   return axios({
      url: `/user/update-address/${aid}`,
      method: 'PUT',
      data,
   })
}
export const setDefaultAddress = (aid) => {
   return axios({
      url: `/user/set-default-address/${aid}`,
      method: 'PATCH',
   })
}
export const updateWishlist = (pid) => {
   return axios({
      url: '/user/wishlist/' + pid,
      method: 'PUT',
   })
}
