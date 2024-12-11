import React, { useCallback, useState, useEffect } from 'react'
import { set, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { InputForm, Select, Markdown, LoadSpinner } from '../../components'
import { validateTinyMCE, fileToBase64 } from '../../ultils/helpers'
import { apiProducts } from '../../redux/apis'
// import icons from '../../ultils/icons'
const CreateProduct = () => {

    const categories = useSelector((state) => state.prodCategory.categories)
    const [isLoading, setIsLoading] = useState(false)
    // const { MdDelete } = icons
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
    const [hoverElm, setHoverElm] = useState(null)
    const [preview, setPreview] = useState({
        thumbnail: '',
        images: []
    })
    useEffect(() => {
        if (watch('thumbnail')) {
            fileToBase64(watch('thumbnail')[0])
                .then((result) => {
                    setPreview((prev) => ({ ...prev, thumbnail: result }));
                })
                .catch((error) => { });
        }
    }, [watch('thumbnail')]);
    useEffect(() => {
        const images = watch('images');
        if (images) {
            const allowedTypes = ['image/png', 'image/jpeg']
            const promises = []
            for (let i = 0; i < images.length; i++) {

                if (allowedTypes.includes(images[i].type)) {
                    promises.push(fileToBase64(images[i]));
                } else {
                    toast.error(`File ${images[i].name} is not a valid PNG or JPG.`)
                    return
                }
            }
            Promise.all(promises)
                .then((result) => {
                    const previewImages = result.map((base64, index) => ({
                        name: images[index].name,
                        path: base64
                    }));
                    setPreview((prev) => ({ ...prev, images: previewImages }));
                })
                .catch((error) => { });
        }
    }, [watch('images')]);

    const [payload, setPayload] = useState({
        description: ''
    })
    const [invalidField, setInvalidField] = useState([])
    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [payload])
    const handleCreateProduct = async (data) => {
        const invalid = validateTinyMCE(payload, setInvalidField)
        if (invalid === 0) {
            if (data.category) data.category = categories.find((item) => item._id === data.category)?.title
            const finalPayload = { ...data, ...payload }
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1])
            }
            if (finalPayload.thumbnail) formData.append('thumbnail', finalPayload.thumbnail[0])
            if (finalPayload.images) {
                for (let i of finalPayload.images) {
                    formData.append('images', i)
                }
            }
            setIsLoading(true)
            const response = await apiProducts.createProduct(formData)
            setIsLoading(false)
            if (response.success) {
                toast.success('Create product successfully')
                reset()
                setPreview({
                    thumbnail: '',
                    images: []
                })
            } else {
                toast.error('Create product failed')
            }
        }
    }
    // const handleRemoveImage = (name) => {
    //     const img = [...watch('images')]

    //     reset({
    //         images: img.filter((img) => img.name !== name)
    //     })
    //     if (preview.images?.some((img) => img.name === name)) setPreview((prev) => ({ ...prev, images: prev.images.filter((img) => img.name !== name) }))

    // }
    return (
        <>
            {!isLoading ? (
                <div className='p-4'>
                    <div className='w-full h-full bg-white shadow rounded-lg p-4'>
                        <div className='w-full'>
                            <form onSubmit={handleSubmit(handleCreateProduct)}>
                                <div className='flex'>
                                    <div className='w-[60%] flex flex-col pr-2 gap-8'>
                                        <div className='flex flex-col gap-3 border border-gray-300 p-5 rounded-md shadow-xl'>
                                            <div className='text-lg font-semibold text-gray-700'>General Information</div>
                                            <InputForm
                                                label='Name product'
                                                register={register}
                                                errors={errors}
                                                id={'title'}
                                                validate={{ required: 'This field is required' }}
                                                placeholder={'Enter name product'}
                                            />
                                            <Markdown
                                                label='Description'
                                                changeValue={changeValue}
                                                name='description'
                                                invalidField={invalidField}
                                                setInvalidField={setInvalidField}
                                            />
                                            <InputForm
                                                label='Color'
                                                register={register}
                                                errors={errors}
                                                id={'color'}
                                                validate={{ required: 'This field is required' }}
                                                placeholder={'Enter color'}
                                                type='text'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-3 border border-gray-300 p-5 rounded-md shadow-xl'>
                                            <div className='text-lg font-semibold text-gray-700'>Upload Image</div>
                                            <div>
                                                <div>
                                                    <label htmlFor='thumbnail' className='block text-sm font-medium text-gray-700'>Upload thumbnail</label>
                                                    <input
                                                        type='file'
                                                        id='thumbnail'
                                                        {...register('thumbnail', { required: 'This field is required' })}
                                                        className='my-auto mt-1 block w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                                    />
                                                    {errors['thumbnail'] && <span className='text-red-500 text-xs'>{errors['thumbnail'].message}</span>}
                                                </div>
                                                <div>
                                                    {preview.thumbnail && <img src={preview.thumbnail} alt='thumbnail' className='w-20 h-20' />}
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <label htmlFor='productImgs' className='block text-sm font-medium text-gray-700'>Upload Images </label>
                                                    <input
                                                        type='file'
                                                        id='productImgs'
                                                        {...register('images', { required: 'This field is required' })}
                                                        multiple
                                                        className='my-auto mt-1 block w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                                    />
                                                    {errors['images'] && <span className='text-red-500 text-xs'>{errors['images'].message}</span>}
                                                </div>
                                                {preview.images.length > 0 && <div className='flex gap-2'>
                                                    {preview?.images?.map((img, index) => (
                                                        <div
                                                            onMouseEnter={() => setHoverElm(img.name)}
                                                            onMouseLeave={() => setHoverElm(null)}
                                                            key={index}
                                                            className='relative'
                                                        >
                                                            <img src={img.path} alt='productImg' className='w-20 h-20' />
                                                            {/* {hoverElm === img.name &&
                                        <div
                                            onClick={() => handleRemoveImage(img.name)}
                                            className='absolute inset-0 bg-gray-700 bg-opacity-30 animate-scale-up-center flex items-center justify-center cursor-pointer'
                                        >
                                            <MdDelete className='text-white text-base' />
                                        </div>} */}
                                                        </div>
                                                    ))}
                                                </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-[40%] flex flex-col pl-2 gap-8'>
                                        <div className='flex flex-col gap-3 border border-gray-300 p-5 rounded-md shadow-xl'>
                                            <div className='text-lg font-semibold text-gray-700'>Category</div>
                                            <Select
                                                label={'Category'}
                                                options={categories?.map((item) => ({ id: item._id, value: item.title }))}
                                                register={register}
                                                id={'category'}
                                                errors={errors}
                                                validate={{ required: 'This field is required' }}
                                            />
                                            <Select
                                                label={'Brand (Optional)'}
                                                options={categories?.find((item) => item._id === watch('category'))?.brand?.map((el) => ({ id: el, value: el }))}
                                                register={register}
                                                id={'brand'}
                                                errors={errors}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-3 border border-gray-300 p-5 rounded-md shadow-xl'>
                                            <div className='text-lg font-semibold text-gray-700'>Pricing and Stock</div>
                                            <InputForm
                                                label='Price'
                                                register={register}
                                                errors={errors}
                                                id={'price'}
                                                validate={{
                                                    required: 'This field is required',
                                                    validate: value =>
                                                        value > 0 || 'Price must be greater than 0'
                                                }}
                                                placeholder={'Enter price'}
                                                type='number'
                                            />
                                            <div className='flex w-full items-center justify-between'>
                                                <div className='w-[49%]'>
                                                    <InputForm
                                                        label='Discount Percentage'
                                                        register={register}
                                                        errors={errors}
                                                        id={'discountPercentage'}
                                                        validate={{
                                                            required: 'This field is required',
                                                            validate: value =>
                                                                value < 100 || 'Discount percentage must be less than 100'
                                                        }}
                                                        placeholder={'Enter discount percentage'}
                                                        type='number'
                                                    />
                                                </div>
                                                <div className='w-[49%]'>
                                                    <InputForm
                                                        label='Quantity'
                                                        register={register}
                                                        errors={errors}
                                                        id={'quantity'}
                                                        validate={{
                                                            required: 'This field is required',
                                                            validate: value =>
                                                                value > 0 || 'Quantity must be greater than 0'
                                                        }}
                                                        placeholder={'Enter quantity'}
                                                        type='number'
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                                <button type='submit' className='bg-green-600 text-white mb-4 p-2 rounded hover:bg-green-500'>Create</button>
                            </form>
                        </div>
                    </div>
                </div>)
                : <LoadSpinner className={'w-full min-h-screen flex items-center justify-center bg-transparent'} />
            }
        </>

    )
}

export default CreateProduct