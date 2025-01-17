import React, { useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { InputForm, Select, Markdown, LoadSpinner } from '../../components'
import { validateTinyMCE, fileToBase64 } from '../../ultils/helpers'
import { apiBlogs } from '../../redux/apis'

const CreateBlog = () => {

    const categories = useSelector((state) => state.blogCategory.categories)
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
    const [preview, setPreview] = useState({
        thumbnail: '',
    })
    useEffect(() => {
        const thumbnail = watch('thumbnail')
        if (thumbnail && thumbnail.length > 0) {
            const allowedTypes = ['image/png', 'image/jpeg']
            const file = thumbnail[0]

            if (allowedTypes.includes(file.type)) {
                fileToBase64(file)
                    .then((result) => {
                        setPreview((prev) => ({ ...prev, thumbnail: result }))
                    })
                    .catch((error) => {
                    })
            } else {
                toast.error('File is not a valid PNG or JPG.')
            }
        }
    }, [watch('thumbnail')])
    const [payload, setPayload] = useState({
        description: ''
    })
    const [invalidField, setInvalidField] = useState([])
    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [payload])
    const handleCreate = async (data) => {
        const invalid = validateTinyMCE(payload, setInvalidField)
        if (invalid === 0) {
            if (data.category) data.category = categories.find((item) => item._id === data.category)?.title
            const finalPayload = { ...data, ...payload }

            const formData = new FormData()
            if (finalPayload.thumbnail) formData.append('thumbnail', finalPayload.thumbnail[0])
            delete finalPayload.thumbnail
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1])
            }
            setIsLoading(true)
            const response = await apiBlogs.createBlog(formData)
            setIsLoading(false)
            if (response.success) {
                reset()
                setPayload({ description: '' })
                setPreview({ thumbnail: '' })
                toast.success('Blog created successfully')
            } else {
                toast.error('Blog creation failed')
            }
        }
    }

    return (
        <>
            {!isLoading ? (
                <div className='p-4'>
                    <div className='w-full h-full bg-white shadow rounded-lg p-4'>
                        <div className='w-full'>
                            <form onSubmit={handleSubmit(handleCreate)}>
                                <div className='flex flex-col pr-2 gap-8'>
                                    <div className='flex flex-col gap-3 border border-gray-300 p-5 rounded-md shadow-xl'>
                                        <div className='text-lg font-semibold text-gray-700'>General Information</div>
                                        <InputForm
                                            label='Title'
                                            register={register}
                                            errors={errors}
                                            id={'title'}
                                            validate={{ required: 'This field is required' }}
                                            placeholder={'Enter title'}
                                        />
                                        <Select
                                            label={'Category'}
                                            options={categories?.map((item) => ({ id: item._id, value: item.title }))}
                                            register={register}
                                            id={'category'}
                                            errors={errors}
                                            validate={{ required: 'This field is required' }}
                                        />
                                        <Markdown
                                            label='Description'
                                            changeValue={changeValue}
                                            name='description'
                                            invalidField={invalidField}
                                            setInvalidField={setInvalidField}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-3 border border-gray-300 p-5 rounded-md shadow-xl'>
                                        <div className='text-lg font-semibold text-gray-700'>Upload Thumbnail</div>
                                        <div>
                                            <label htmlFor='thumbnail' className="bg-white text-gray-500 font-semibold text-base rounded w-80 h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif] relative overflow-hidden hover:bg-black hover:bg-opacity-30">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`w-11 mb-2 fill-gray-500 ${preview.thumbnail ? 'hidden' : 'block'}`} viewBox="0 0 32 32">
                                                    <path
                                                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                                        data-original="#000000" />
                                                    <path
                                                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                                        data-original="#000000" />
                                                </svg>
                                                <span className={`text-center ${preview.thumbnail ? 'hidden' : 'block'}`}>
                                                    Upload file
                                                    <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG are Allowed.</p>
                                                </span>
                                                <input
                                                    type='file'
                                                    id='thumbnail'
                                                    {...register('thumbnail', { required: 'This field is required' })}
                                                    className='hidden'
                                                />
                                                {preview.thumbnail && (
                                                    <img
                                                        src={preview.thumbnail}
                                                        alt="thumbnail"
                                                        className="w-full h-full object-cover border border-gray-300 rounded"
                                                    />
                                                )}
                                            </label>
                                            {errors['thumbnail'] && <span className='text-red-500 text-xs'>{errors['thumbnail'].message}</span>}

                                        </div>
                                    </div>
                                </div>

                                <button type='submit' className='bg-green-600 text-white mb-4 p-2 rounded hover:bg-green-500 mt-5'>Create</button>
                            </form>
                        </div>
                    </div>
                </div>)
                : <LoadSpinner className={'w-full min-h-screen flex items-center justify-center bg-transparent'} />
            }
        </>
    )
}

export default CreateBlog