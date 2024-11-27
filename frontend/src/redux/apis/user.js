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
