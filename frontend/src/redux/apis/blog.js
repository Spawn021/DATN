import axios from '../../axios'

export const getBlogs = (params) => {
    return axios({
        url: '/blog/get-all',
        method: 'GET',
        params,
    })
}
export const getBlog = (bid) => {
    return axios({
        url: '/blog/get/' + bid,
        method: 'GET',
    })
}
export const createBlog = (data) => {
    return axios({
        url: '/blog/create',
        method: 'POST',
        data
    })
}
export const updateBlog = (data, bid) => {
    return axios({
        url: '/blog/update/' + bid,
        method: 'PUT',
        data
    })
}
export const deleteBlog = (bid) => {
    return axios({
        url: '/blog/delete/' + bid,
        method: 'DELETE',
    })
}