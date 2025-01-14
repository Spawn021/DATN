import axios from '../../axios'

export const checkCoupon = (data) => {
    return axios({
        url: '/coupon/check',
        method: 'POST',
        data
    })
}
export const getAllCoupons = (params) => {
    return axios({
        url: '/coupon/get-all',
        method: 'GET',
        params
    })
}
export const createCoupon = (data) => {
    return axios({
        url: '/coupon/create',
        method: 'POST',
        data
    })
}
export const updateCoupon = (cid, data) => {
    return axios({
        url: `/coupon/update/${cid}`,
        method: 'PUT',
        data
    })
}
export const deleteCoupon = (cid) => {
    return axios({
        url: `/coupon/delete/${cid}`,
        method: 'DELETE',
    })
}
