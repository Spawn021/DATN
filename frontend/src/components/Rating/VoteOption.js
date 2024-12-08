import React, { memo, useRef, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import logo from '../../assets/logo.png'
import { voteOptions } from '../../ultils/constants'
import icons from '../../ultils/icons'
import { showModal } from '../../redux/features/modalSlice'

const VoteOption = ({ nameProduct, handleSubmitRating }) => {
    const dispatch = useDispatch()
    const { FaStar } = icons
    const [chooseStar, setChooseStar] = useState(null)
    const [comment, setComment] = useState('')
    const modalRef = useRef()
    useEffect(() => {
        modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })

    }, [])

    return (
        <div onClick={e => e.stopPropagation()} ref={modalRef} className='bg-white rounded shadow-lg w-[768px] gap-5 max-w-full min-h-[480px] p-4 flex flex-col items-center justify-center'>
            <img src={logo} alt='logo' className='w-[300px]' />
            <h2 className='text-lg font-medium text-center'>{`Thank you for voting for  ${nameProduct}`}</h2>
            <div className="relative w-full min-w-[200px]">
                <textarea
                    className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=""
                    value={comment}
                    onChange={e => setComment(e.target.value)}></textarea>
                <label
                    className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-black transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-500 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-500 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-[#00000080] peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-black peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Your message
                </label>
            </div>
            <div className='w-full flex flex-col gap-4'>
                <p>How do you like this product?</p>
                <div className='flex justify-around items-center gap-4'>
                    {voteOptions.map((el, index) => {
                        return (
                            <div onClick={() => setChooseStar(el.id)} key={index} className='bg-gray-200 hover:bg-gray-300 cursor-pointer p-4 w-[130px] flex flex-col items-center gap-2'>
                                {chooseStar && chooseStar >= el.id ? <FaStar className='text-yellow-400' /> : <FaStar className='text-gray-400' />}

                                <span>{el.value}</span>

                            </div>
                        )

                    })}
                </div>
            </div>
            <div className='w-full flex justify-center gap-5 mt-5'>
                <button onClick={() => {
                    handleSubmitRating({ comment, star: chooseStar })
                    dispatch(showModal({ isShowModal: false, modalContent: null }))
                }}
                    className='px-6 py-2 bg-main text-white rounded hover:bg-[#ee313180]'>Submit</button>
                <button onClick={() => dispatch(showModal({ isShowModal: false, modalContent: null }))} className='px-6 py-2 bg-black text-white  border-black rounded hover:bg-opacity-50 hover:text-white'>Cancel</button>
            </div>

        </div >
    )
}

export default memo(VoteOption)