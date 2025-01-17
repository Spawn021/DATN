import axios from '../../axios'

export const getAllBlogCategory = async (params) => {
    return axios({
        url: '/blog-category/get-all',
        method: 'GET',
        params,
    })
}
export const createBlogCategory = async (data) => {
    return axios({
        url: '/blog-category/create',
        method: 'POST',
        data,
    })
}
export const updateBlogCategory = async (bcid, data) => {
    return axios({
        url: `/blog-category/update/${bcid}`,
        method: 'PUT',
        data,
    })
}
export const deleteBlogCategory = async (bcid) => {
    return axios({
        url: `/blog-category/delete/${bcid}`,
        method: 'DELETE',
    })
}