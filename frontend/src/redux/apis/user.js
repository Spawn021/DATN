import axios from '../../axios'

export const register = (data) => {
   return axios({
      url: '/user/register',
      method: 'POST',
      data,
   })
}
export const login = (data) => {
   return axios({
      url: '/user/login',
      method: 'POST',
      data,
   })
}
