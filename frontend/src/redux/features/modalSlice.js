import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isShowModal: false,
        modalContent: null,
    },
    reducers: {
        showModal: (state, action) => {
            // console.log(action.payload)
            state.isShowModal = action.payload.isShowModal
            state.modalContent = action.payload.modalContent
        },
    },

})

export const { showModal } = modalSlice.actions
export default modalSlice.reducer
