import axios from '../../axios'
export const createOrder = (data) => {
    return axios({
        url: '/order/create',
        method: 'POST',
        data,
    })
}
export const getOrder = (params) => {
    return axios({
        url: '/order/get',
        method: 'GET',
        params
    })
}
export const getAllOrder = (params) => {
    return axios({
        url: '/order/get-all',
        method: 'GET',
        params
    })
}
export const updateStatusOrder = (oid, data) => {
    return axios({
        url: `/order/update-status/${oid}`,
        method: 'PUT',
        data,
    })
}