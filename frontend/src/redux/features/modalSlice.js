import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isShowModal: false,
        modalContent: null,
        isShowCart: false,
        isShowChangeAddressModal: false,
        changeAddressModalContent: null,
    },
    reducers: {
        showModal: (state, action) => {
            // console.log(action.payload)
            state.isShowModal = action.payload.isShowModal
            state.modalContent = action.payload.modalContent
        },
        showCart: (state) => {
            state.isShowCart = state.isShowCart ? false : true
        },
        showChangeAddressModal: (state, action) => {
            state.isShowChangeAddressModal = action.payload.isShowChangeAddressModal
            state.changeAddressModalContent = action.payload.changeAddressModalContent
        }
    },

})

export const { showModal, showCart, showChangeAddressModal } = modalSlice.actions
export default modalSlice.reducer
