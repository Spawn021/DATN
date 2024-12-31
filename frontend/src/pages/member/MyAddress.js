import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import icons from '../../ultils/icons'
import { apiUsers } from '../../redux/apis'
import { showModal } from '../../redux/features/modalSlice'
import { Address } from '../../components'

const MyAddress = () => {
    const dispatch = useDispatch()
    const { FaPlus, CiEdit, MdDelete } = icons
    const [addresses, setAddresses] = useState([])
    const getAddresses = async () => {
        const response = await apiUsers.getAddresses()
        if (response.success) {
            setAddresses(response.addresses)
        } else {
            setAddresses([])
        }
    }
    useEffect(() => {
        getAddresses()
    }, [])
    const handleAddAddress = () => {
        dispatch(showModal({ isShowModal: true, modalContent: <Address addresses={addresses} onSave={getAddresses} /> }))
    }
    const handleEdit = (id, addressData) => {
        dispatch(showModal({ isShowModal: true, modalContent: <Address addresses={addresses} addressData={addressData} onSave={getAddresses} /> }))
    }
    const handleDelete = (id) => {
        const addressToDelete = addresses.find(address => address._id === id)
        if (addresses.length === 1) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'This is your last address. Deleting it will remove all saved addresses!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await apiUsers.deleteAddress(id);
                    if (response.success) {
                        getAddresses(); // Cập nhật lại danh sách địa chỉ
                    }
                }
            });
            return;
        }

        if (addressToDelete.isDefault) {
            Swal.fire({
                title: 'Cannot delete the default address!',
                text: 'Please set another address as default before deleting.',
                icon: 'warning',
                confirmButtonText: 'OK',
            })
            return
        }
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this address!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiUsers.deleteAddress(id)
                if (response.success) {
                    getAddresses()

                }
            }
        })
    }
    return (
        <div className='w-3/4 m-auto mt-4'>
            <div className='w-full h-full bg-white min-h-hp shadow rounded-lg p-4'>
                <div className='w-full'>
                    <div className='w-full flex justify-between items-center'>
                        <div className='text-lg font-medium'>Address</div>
                        <button onClick={handleAddAddress} className='bg-main text-white px-4 py-2 rounded-md flex gap-3 items-center'>
                            <FaPlus />
                            <span className='text-base font-medium'>Add New Address</span>
                        </button>
                    </div>
                    <div className='w-full mt-8'>
                        {addresses.length > 0 ? addresses.map((address, index) => (
                            <div key={index} className='w-full border-b border-gray-200 border-dashed py-4 flex justify-between'>
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
                                        <span onClick={() => handleDelete(address._id)} className='text-red-500 hover:text-red-700 group relative cursor-pointer'>
                                            <MdDelete size={23} />
                                            <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                Delete
                                            </div>
                                        </span>
                                    </div>

                                </div>
                            </div>
                        )) :
                            <div className='text-center text-gray-400'>You have no address. Please add one to order products.</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyAddress