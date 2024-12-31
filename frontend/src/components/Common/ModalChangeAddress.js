
import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import { showChangeAddressModal } from '../../redux/features/modalSlice'
const ModalChangeAddress = ({ children }) => {
    const dispatch = useDispatch()

    return (
        <div onClick={() => dispatch(showChangeAddressModal({ isShowChangeAddressModal: false, changeAddressModalContent: null }))} className='absolute inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center'>{children}</div>
    )
}

export default memo(ModalChangeAddress)