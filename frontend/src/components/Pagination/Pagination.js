import React, { memo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import usePagination from '../../hooks/usePagination'
import { PagiItem } from '../../components'
import useDebounce from '../../hooks/useDebounce'

const Pagination = ({ totalCount, pageSize = 10 }) => {
    const [params, setParams] = useSearchParams()
    const [inputPage, setInputPage] = useState('')
    const currentPage = parseInt(params.get('page') || 1)

    const totalPages = Math.ceil(totalCount / pageSize)
    const pagination = usePagination(totalCount, currentPage, 1, pageSize)

    const range = () => {
        const start = (currentPage - 1) * pageSize + 1
        const end = Math.min(currentPage * pageSize, totalCount)
        return `${start} - ${end}`
    };

    const handlePageChange = (newPage) => {
        const queries = Object.fromEntries(params.entries())
        setParams({ page: newPage })
        setInputPage('')
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.activeElement.blur();
    };
    const debouncedInput = useDebounce(inputPage, 500)
    useEffect(() => {
        const pageNumber = parseInt(debouncedInput, 10)
        if (!isNaN(pageNumber) && pageNumber >= 1) {
            handlePageChange(Math.min(pageNumber, totalPages))
        }
    }, [debouncedInput])
    const handleInputChange = (e) => {
        const value = e.target.value
        if (/^\d*$/.test(value)) {
            setInputPage(value)
        }

    }
    return (
        <div className="flex justify-between items-center">
            <div className="text-sm italic">
                {`Showing ${range()} entries of ${totalCount}`}
            </div>
            <div className="flex items-center ">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`h-10 px-2 flex items-center justify-center border-solid border-[1px] border-[#dee2e6] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ' hover:bg-gray-300 text-[#007bff]'}`}
                >
                    Previous
                </button>
                {pagination?.map((page, index) => (
                    <PagiItem key={index}>
                        {page === '...' ? (
                            <span className="text-xl mb-1">...</span>
                        ) : (
                            page
                        )}
                    </PagiItem>
                ))}
                <button
                    type="button"
                    disabled={currentPage === Math.ceil(totalCount / pageSize)}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`h-10 px-2 flex items-center justify-center border-solid border-[1px] border-[#dee2e6] ${currentPage === Math.ceil(totalCount / pageSize) ? 'opacity-50 cursor-not-allowed' : ' hover:bg-gray-300 text-[#007bff]'}`}
                >
                    Next
                </button>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-sm">Go to page:</div>
                <input
                    type="text"
                    value={inputPage}
                    onChange={handleInputChange}
                    placeholder=""
                    className="border border-gray-300 px-2 py-1 rounded w-10 text-center focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>

    );
};

export default memo(Pagination);
