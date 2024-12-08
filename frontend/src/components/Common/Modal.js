import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import { showModal } from '../../redux/features/modalSlice'
const Modal = ({ children }) => {
    const dispatch = useDispatch()

    return (
        <div onClick={() => dispatch(showModal({ isShowModal: false, modalContent: null }))} className='absolute inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>{children}</div>
    )
}

export default memo(Modal)