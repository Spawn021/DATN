import React from 'react'
import { useSearchParams, useNavigate, useParams, createSearchParams } from 'react-router-dom'

const PagiItem = ({ children }) => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const { category } = useParams()
    const handlePagination = () => {
        let param = [...params.entries()]
        let queries = {}
        param.forEach((item) => {
            queries[item[0]] = item[1]
        })
        if (Number(children)) {
            queries.page = children
        }
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString(),
        })

    }

    return (
        <button
            type='button'
            disabled={!Number(children)}
            onClick={handlePagination}
            className={`w-10 h-10 flex items-center justify-center ${Number(children) ? 'hover:rounded-full hover:bg-gray-300' : ''} ${params.get('page') === children.toString() ? 'bg-gray-300 rounded-full' : ''} ${!params.get('page') && children.toString() === '1' ? 'bg-gray-300 rounded-full' : ''}`}
        >
            {children}
        </button>
    )
}

export default PagiItem