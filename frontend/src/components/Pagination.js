import React from 'react';
import { useSearchParams } from 'react-router-dom';
import usePagination from '../hooks/usePagination';
import { PagiItem } from '../components';

const Pagination = ({ totalCount }) => {
    const [params] = useSearchParams();
    const pagination = usePagination(totalCount, 2);
    const range = () => {
        const currentPage = params.get('page')
        const pageSize = process.env.REACT_APP_PRODUCT_LIMIT || 10
        const start = (currentPage - 1) * pageSize + 1
        const end = Math.min(currentPage * pageSize, totalCount)

        return `${start} - ${end}`
    }

    return (
        <div className='flex justify-between items-center'>
            {
                !params.get('page') && (
                    <div className='text-sm italic'>{`Showing 1 - ${process.env.REACT_APP_PRODUCT_LIMIT || 10} entries of ${totalCount}`}</div>
                )
            }
            {
                params.get('page') && (
                    <div className='text-sm italic'>{`Showing ${range()} entries of ${totalCount}`}</div>
                )
            }
            <div className="flex items-center">
                {pagination?.map((page, index) => (
                    <PagiItem key={index}>
                        {page === '...' ? (
                            <span className="text-xl mb-1">...</span>
                        ) : (
                            page
                        )}
                    </PagiItem>
                ))}
            </div>
        </div>
    );
};

export default Pagination;
