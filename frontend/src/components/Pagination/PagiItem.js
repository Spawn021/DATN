import React, { memo, useEffect } from 'react'
import { useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom'

const PagiItem = ({ children }) => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const location = useLocation()
    const handlePagination = () => {
        let queries = Object.fromEntries(params.entries())
        if (Number(children)) {
            queries.page = children
        }
        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString(),
        })
    }
    useEffect(() => {
        const scrollableContainer = document.getElementsByClassName('w-full h-screen overflow-y-auto')[0]
        if (scrollableContainer) {
            scrollableContainer.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, [params]);
    return (

        <button
            type='button'
            disabled={!Number(children)}
            onClick={handlePagination}
            className={`w-10 h-10 flex items-center justify-center border-solid border-[1px] border-[#dee2e6]
                ${params.get('page') === children.toString() || (!params.get('page') && children.toString() === '1') ? 'bg-[#3f6ad8] text-white' : 'text-[#007bff] bg-white '} 
                ${Number(children) ? 'hover:bg-gray-300 hover:text-[#0056b3]' : ''}`}

        >
            {children}
        </button>
    )
}

export default memo(PagiItem)