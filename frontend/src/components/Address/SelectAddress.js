import React, { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import icons from '../../ultils/icons'
import { Address } from '../../components'
import { showModal, showChangeAddressModal } from '../../redux/features/modalSlice'

const SelectAddress = ({ addresses, onSave, handleChangeAddress }) => {

    const dispatch = useDispatch()
    const { CiEdit, FaPlus } = icons
    const [selectedAddress, setSelectedAddress] = useState(null)

    const handleEdit = (id, addressData) => {
        dispatch(showModal({ isShowModal: true, modalContent: <Address addresses={addresses} addressData={addressData} onSave={onSave} /> }))
    }
    const handleAddAddress = () => {
        dispatch(showModal({ isShowModal: true, modalContent: <Address addresses={addresses} onSave={onSave} /> }))
    }
    const handleSelectAddress = (address) => {
        setSelectedAddress(address)

    }
    const handleSave = () => {
        handleChangeAddress(selectedAddress)
        dispatch(showChangeAddressModal({ isShowChangeAddressModal: false, changeAddressModalContent: null }))
    }
    return (
        <div onClick={e => e.stopPropagation()} className='bg-white rounded shadow-lg w-[564px] gap-5 max-w-full min-h-[500px] p-4 flex flex-col justify-between'>
            <div>
                <div className='flex justify-between items-center pb-4 border-b-2'>
                    <h2 className='text-lg font-medium '>My Address</h2>
                    <button onClick={handleAddAddress} className=' border px-4 py-2 flex gap-3 items-center hover:bg-gray-300'>
                        <FaPlus />
                        <span className='text-base'>Add New Address</span>
                    </button>
                </div>
                <div className='w-full mt-1 max-h-[400px] overflow-y-auto overflow-x-hidden'>
                    {addresses.length > 0 ? addresses.map((address, index) => (
                        <div key={index} className='w-full border-b border-gray-200 border-dashed py-4 flex gap-2'>
                            <input
                                type="checkbox"
                                checked={selectedAddress?._id === address._id}
                                onChange={() => handleSelectAddress(address)}
                                className="mr-2 hover:cursor-pointer"
                            />
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col cursor-default'>
                                    <div className='flex'>
                                        <span className='font-medium border-r pr-2'>{address.name}</span>
                                        <span className='ml-2 text-gray-500'>{address.phone}</span>
                                    </div>
                                    <span className='text-gray-500'>{address.addressLine1}</span>
                                    <div className='text-gray-500'>{`${address.city}, ${address.state}, ${address.country}`}</div>
                                    <div>
                                        {address.isDefault && <button className='text-main border-main border cursor-default px-1'>Default</button>}
                                    </div>
                                </div>
                                <div>
                                    <div className='flex gap-4'>
                                        <span onClick={() => handleEdit(address._id, address)} className='text-blue-500 hover:text-blue-700 group relative cursor-pointer'>
                                            <CiEdit size={23} />
                                            <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                Edit
                                            </div>
                                        </span>

                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                        : <div className='text-center text-gray-400'>No address found. Please add one</div>
                    }
                </div>
            </div>
            <div className='flex justify-end'>
                <div>
                    <button onClick={() => dispatch(showChangeAddressModal({ isShowChangeAddressModal: false, changeAddressModalContent: null }))} type='button' className='border border-gray-300 px-4 py-2 rounded-md mr-2 hover:bg-gray-50'>Cancel</button>
                    <button onClick={handleSave} className='bg-main text-white px-4 py-2 rounded-md hover:bg-red-700 '>
                        Save
                    </button>
                </div>
            </div>


        </div>
    )
}

export default memo(SelectAddress)