import { useMemo } from 'react'
import { generatePaginationArray } from '../ultils/helpers'


const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
    const paginationArray = useMemo(() => {
        const productsPerPage = process.env.REACT_APP_PRODUCT_LIMIT || 10
        const paginationCount = Math.ceil(totalProductCount / productsPerPage)
        const totalPageNumbers = siblingCount + 5
        if (paginationCount <= totalPageNumbers) {
            return generatePaginationArray(1, paginationCount)
        }
        const isShowLeftDots = currentPage > siblingCount + 2
        const isShowRightDots = currentPage < paginationCount - siblingCount - 1
        if (isShowLeftDots && !isShowRightDots) {
            let rightStart = paginationCount - 2 * siblingCount - 2
            const rightRange = generatePaginationArray(rightStart, paginationCount)
            return [1, '...', ...rightRange]
        } else if (!isShowLeftDots && isShowRightDots) {
            let leftRange = generatePaginationArray(1, 5)
            return [...leftRange, '...', paginationCount]
        }
        const siblingLeft = Math.max(currentPage - siblingCount, 1)
        const siblingRight = Math.min(currentPage + siblingCount, paginationCount)
        if (isShowLeftDots && isShowRightDots) {
            const middleRange = generatePaginationArray(siblingLeft, siblingRight)
            return [1, '...', ...middleRange, '...', paginationCount]
        }


    }, [totalProductCount, currentPage, siblingCount])

    return paginationArray
}

export default usePagination