import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isShowModal: false,
        modalContent: null,
        isShowCart: false,
    },
    reducers: {
        showModal: (state, action) => {
            // console.log(action.payload)
            state.isShowModal = action.payload.isShowModal
            state.modalContent = action.payload.modalContent
        },
        showCart: (state) => {
            state.isShowCart = state.isShowCart ? false : true
        }
    },

})

export const { showModal, showCart } = modalSlice.actions
export default modalSlice.reducer
