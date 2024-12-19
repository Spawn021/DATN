import axios from '../../axios'

export const checkCoupon = (data) => {
    return axios({
        url: '/coupon/check',
        method: 'POST',
        data
    })
}
