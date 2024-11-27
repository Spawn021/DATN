import axios from 'axios'

const instance = axios.create({
   baseURL: process.env.REACT_APP_API_URL,
})

// let isRefreshing = false
// let refreshTokenPromise = null

// Interceptor request
instance.interceptors.request.use(
   (config) => {
      let localStorageData = window.localStorage.getItem('persist:user')
      if (localStorageData && typeof localStorageData === 'string') {
         localStorageData = JSON.parse(localStorageData)
         const accessToken = JSON.parse(localStorageData.token)
         config.headers['Authorization'] = `Bearer ${accessToken}`
      }
      return config
   },
   (error) => Promise.reject(error),
)

// Interceptor response
instance.interceptors.response.use(
   function (response) {
      return response.data
   },
   function (error) {
      // const originalRequest = error.config

      // // Nếu nhận được lỗi 401 (Unauthorized)
      // if (error.response.status === 401 && !originalRequest._retry) {
      //    originalRequest._retry = true

      //    // Nếu đang refresh token, chờ kết quả từ Promise đó
      //    if (isRefreshing) {
      //       try {
      //          const newAccessToken = await refreshTokenPromise
      //          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
      //          return axios(originalRequest)
      //       } catch (err) {
      //          return Promise.reject(err)
      //       }
      //    }

      //    // Bắt đầu quá trình refresh token
      //    isRefreshing = true
      //    refreshTokenPromise = refreshAccessToken()

      //    try {
      //       const newAccessToken = await refreshTokenPromise
      //       // Cập nhật access token mới vào localStorage
      //       let localStorageData = JSON.parse(window.localStorage.getItem('persist:user'))
      //       localStorageData.token = JSON.stringify(newAccessToken)
      //       window.localStorage.setItem('persist:user', JSON.stringify(localStorageData))

      //       // Gọi lại request ban đầu với access token mới
      //       originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
      //       return axios(originalRequest)
      //    } catch (err) {
      //       return Promise.reject(err)
      //    } finally {
      //       isRefreshing = false
      //       refreshTokenPromise = null
      //    }
      // }

      return error.response.data
   },
)

// // Hàm gọi API refresh token
// const refreshAccessToken = async () => {
//    const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {}, { withCredentials: true })
//    return response.data.newAccessToken
// }

export default instance
