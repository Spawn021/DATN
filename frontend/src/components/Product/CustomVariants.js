import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { InputForm, LoadSpinner } from '../../components'
import icons from '../../ultils/icons'
import { fileToBase64 } from '../../ultils/helpers'
import { apiProducts } from '../../redux/apis'

const CustomVariants = ({ customVariants, setCustomVariants, render }) => {
    const { FaPlus, MdDelete } = icons
    const [isLoading, setIsLoading] = useState(false)
    const [preview, setPreview] = useState({
        thumbnail: '',
        images: []
    })
    const [hoverElm, setHoverElm] = useState(null)
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
    useEffect(() => {
        reset({
            title: customVariants?.title,
            price: customVariants?.price,
            color: customVariants?.color
        })
    }, [customVariants])
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

    useEffect(() => {
        const images = watch('images');
        if (images && images.length > 0) {
            const allowedTypes = ['image/png', 'image/jpeg'];
            const promises = [];
            const newFiles = [];

            for (let i = 0; i < images.length; i++) {
                const file = images[i];
                if (allowedTypes.includes(file.type)) {
                    promises.push(fileToBase64(file));
                    newFiles.push({ name: file.name, file });
                } else {
                    toast.error(`File ${file.name} is not a valid PNG or JPG.`);
                    return;
                }
            }

            Promise.all(promises)
                .then((result) => {
                    const previewImages = result.map((base64, index) => ({
                        name: newFiles[index].name,
                        path: base64,
                        file: newFiles[index].file,
                    }));

                    setPreview((prev) => ({
                        ...prev,
                        images: [...prev.images, ...previewImages],
                    }));

                })
                .catch((error) => {
                    toast.error('Error processing files');
                });
        }
    }, [watch('images')]);
    const handleRemoveImage = (name) => {
        const newImages = preview.images.filter((img) => img.name !== name)
        setPreview((prev) => ({ ...prev, images: newImages }))
    }
    const handleAddVariants = async (data) => {
        const finalPayload = { ...data }

        const formData = new FormData()
        for (let i of Object.entries(finalPayload)) {
            formData.append(i[0], i[1])
        }
        if (finalPayload.thumbnail) formData.append('thumbnail', finalPayload.thumbnail[0])

        preview.images.forEach((img) => {
            formData.append('images', img.file);
        })
        setIsLoading(true)
        const response = await apiProducts.addVariants(formData, customVariants._id)
        setIsLoading(false)
        if (response.success) {
            toast.success('Create variants successfully')
            reset()
            setPreview({
                thumbnail: '',
                images: []
            })
        } else {
            toast.error('Create variants failed')
        }
    }
    return (

        <>
            {!isLoading ? (<div>
                <div className='flex items-center justify-between'>
                    <div className='text-lg font-semibold text-gray-700'>Custom Variants</div>
                    <button onClick={() => setCustomVariants(null)} className='bg-main text-white mb-4 p-2 rounded hover:bg-red-700 mt-5'>Back</button>
                </div>
                <form onSubmit={handleSubmit(handleAddVariants)}>
                    <div className='flex flex-col gap-2'>
                        <InputForm
                            label='Name product'
                            register={register}
                            errors={errors}
                            id={'title'}
                            placeholder={'Enter name'}
                            type='text'
                            validate={{ required: 'This field is required' }}
                        />
                        <div className='flex items-center justify-between w-full'>
                            <div className='w-[49%]'>
                                <InputForm
                                    label='Price variant'
                                    register={register}
                                    errors={errors}
                                    id={'price'}
                                    placeholder={'Enter price'}
                                    type='number'
                                    validate={{ required: 'This field is required' }}
                                />
                            </div>
                            <div className='w-[49%]'>
                                <InputForm
                                    label='Color variant'
                                    register={register}
                                    errors={errors}
                                    id={'color'}
                                    placeholder={'Enter color'}
                                    type='text'
                                    validate={{
                                        required: 'This field is required',
                                        validate: (value) =>
                                            value !== customVariants?.color || `Color must be different from "${customVariants?.color}"`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className='text-lg font-semibold text-gray-700'>Upload Image</div>
                        <div>
                            <div className='text-sm font-medium text-gray-700'>Upload thumbnail</div>
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
                        <div>
                            <div>

                                <div className='text-sm font-medium text-gray-700 mt-5'>Upload images</div>
                                <div className='grid grid-cols-8 gap-2 mt-3'>
                                    {preview.images.length > 0 &&
                                        preview?.images?.map((img, index) => (
                                            <div
                                                onMouseEnter={() => setHoverElm(img.name)}
                                                onMouseLeave={() => setHoverElm(null)}
                                                key={index}
                                                className='relative'
                                            >
                                                <img src={img.path} alt='productImg' className='w-40 h-40' />
                                                {hoverElm === img.name &&
                                                    <div
                                                        className='absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center animate-scale-up-center cursor-pointer'
                                                        onClick={() => handleRemoveImage(img.name)}
                                                    >
                                                        <MdDelete className='text-white text-3xl' />
                                                    </div>
                                                }
                                            </div>
                                        ))

                                    }
                                    <label htmlFor='productImgs' className='bg-white text-gray-500 font-semibold text-base rounded w-40 h-40 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed font-[sans-serif] relative overflow-hidden hover:bg-black hover:bg-opacity-30'>
                                        <FaPlus className='text-4xl mb-2 fill-gray-500' />
                                        <span className='text-center' >
                                            Upload file
                                            <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG are Allowed.</p>
                                        </span>
                                        <input
                                            type='file'
                                            id='productImgs'
                                            {...register('images', { required: 'This field is required' })}
                                            multiple
                                            className='hidden'
                                        />
                                    </label>
                                </div>

                                {errors['images'] && <span className='text-red-500 text-xs'>{errors['images'].message}</span>}
                            </div>

                        </div>

                    </div>
                    <button type='submit' className='bg-green-600 text-white mb-4 p-2 rounded hover:bg-green-500 mt-5'>Create</button>
                </form>
            </div>) : <LoadSpinner className={'w-full min-h-screen flex items-center justify-center bg-transparent'} />}
        </>

    )
}

export default memo(CustomVariants)