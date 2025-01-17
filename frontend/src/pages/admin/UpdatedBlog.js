import React, { memo, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { InputForm, Select, Markdown, LoadSpinner } from '../../components'
import { validateTinyMCE, fileToBase64 } from '../../ultils/helpers'
import { apiBlogs } from '../../redux/apis'

const UpdatedBlog = ({ editBlog, render, setEditBlog }) => {
    const categories = useSelector((state) => state.blogCategory.categories)
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
    const [preview, setPreview] = useState({
        thumbnail: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [payload, setPayload] = useState({
        description: ''
    })
    const [invalidField, setInvalidField] = useState([])

    useEffect(() => {
        if (editBlog) {
            reset({
                title: editBlog.title,
                category: editBlog?.category,
            })
            setPayload({ description: typeof editBlog.description === 'object' ? editBlog.description.join(', ') : editBlog.description })
            setPreview({
                thumbnail: editBlog.thumbnail,
            })
        }
    }, [editBlog])

    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [payload])
    useEffect(() => {
        const thumbnail = watch('thumbnail');
        if (thumbnail && thumbnail.length > 0) {
            const allowedTypes = ['image/png', 'image/jpeg'];
            const file = thumbnail[0];

            if (allowedTypes.includes(file.type)) {
                fileToBase64(file)
                    .then((result) => {
                        setPreview((prev) => ({ ...prev, thumbnail: result }));

                    })
                    .catch((error) => {
                    });
            } else {
                toast.error('File is not a valid PNG or JPG.');
            }
        }
    }, [watch('thumbnail')]);
    const handleUpdateBlog = async (data) => {
        const invalid = validateTinyMCE(payload, setInvalidField)
        if (invalid === 0) {
            if (data.category) data.category = categories.find((item) => item.title === data.category)?.title
            const finalPayload = { ...data, ...payload, ...preview }
            const formData = new FormData()
            formData.append('title', finalPayload.title)
            formData.append('category', finalPayload.category)
            formData.append('description', finalPayload.description)
            if (finalPayload.thumbnail) {

                if (typeof finalPayload.thumbnail === 'string') {
                    const response = await fetch(finalPayload.thumbnail)
                    const blob = await response.blob()  // Tải ảnh dưới dạng Blob
                    formData.append('thumbnail', blob, 'thumbnail.jpg')  // Thêm Blob vào FormData
                } else {
                    // Nếu thumbnail là File, bạn có thể thêm trực tiếp vào FormData
                    formData.append('thumbnail', finalPayload.thumbnail)
                }
            }

            setIsLoading(true)
            const response = await apiBlogs.updateBlog(formData, editBlog._id)
            setIsLoading(false)
            if (response.success) {
                toast.success('Update blog successfully')
                render()
                setEditBlog(null)
            } else {
                toast.error('Update blog failed')
            }
        }
    }

    return (
        <>
            {!isLoading ?
                <div>
                    <div className='flex items-center justify-between'>
                        <div className='text-lg font-semibold text-gray-700'>Update Blog</div>
                        <button onClick={() => setEditBlog(null)} className='bg-main text-white mb-4 p-2 rounded hover:bg-red-700 mt-5'>Back</button>
                    </div>
                    <form onSubmit={handleSubmit(handleUpdateBlog)}>
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
                                    options={categories?.map((item) => ({ id: item.title, value: item.title }))}
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
                                    value={payload.description}
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
                                            {...register('thumbnail')}
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

                        <button type='submit' className='bg-green-600 text-white mb-4 p-2 rounded hover:bg-green-500 mt-5'>Update</button>

                    </form>
                </div>
                : <LoadSpinner className={'w-full min-h-screen flex items-center justify-center bg-transparent'} />
            }
        </>

    )
}

export default memo(UpdatedBlog)