import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { showModal } from '../../redux/features/modalSlice'
import { InputForm } from '../../components'
import { apiBlogCategories } from '../../redux/apis'

const CreateBlogCategories = ({ onSave }) => {
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm()
    const handleSave = async (data) => {
        const response = await apiBlogCategories.createBlogCategory(data)
        if (response.success) {
            toast.success('Create blog category successfully')
            dispatch(showModal({ isShowModal: false, modalContent: null }))
            onSave()
        }
    }
    return (
        <div onClick={e => e.stopPropagation()} className='bg-white rounded shadow-lg w-[564px] gap-5 max-w-full h-[556px] p-4 '>
            <form onSubmit={handleSubmit(handleSave)} className='flex flex-col h-full'>
                <h2 className='text-lg font-medium'>Add New Blog Category</h2>
                <div className='w-full flex flex-col gap-3 mt-3 justify-between h-full'>
                    <div className='flex flex-col gap-4'>
                        <InputForm
                            label='Title'
                            register={register}
                            errors={errors}
                            id={'title'}
                            validate={{ required: 'This field is required' }}
                            placeholder={'Enter title'}
                        />
                    </div>
                    <div className='flex justify-end'>
                        <div>
                            <button onClick={() => dispatch(showModal({ isShowModal: false, modalContent: null }))} type='button' className='border border-gray-300 px-4 py-2 rounded-md mr-2 hover:bg-gray-50'>Cancel</button>
                            <button
                                type='submit'
                                className='bg-main text-white px-4 py-2 rounded-md hover:bg-red-700'

                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateBlogCategories