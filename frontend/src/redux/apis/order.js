import axios from '../../axios'
export const createOrder = (data) => {
    return axios({
        url: '/order/create',
        method: 'POST',
        data,
    })
}