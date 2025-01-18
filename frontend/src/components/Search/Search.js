import React, { memo, useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { InputField } from '../../components';
import icons from '../../ultils/icons';
import { apiProducts } from '../../redux/apis';
import useDebounce from '../../hooks/useDebounce';

const Search = () => {
    const { FaSearch } = icons;
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    const getProducts = async (queries) => {
        const response = await apiProducts.getProducts({ ...queries, limit: 5 });
        if (response.success) {
            setProducts(response.products);
        } else {
            setProducts([]);
        }
    }

    const queryDebounce = useDebounce(query, 800);

    useEffect(() => {
        if (queryDebounce) {
            getProducts({ title: queryDebounce });
            setShowResults(true);
        } else {
            setProducts([]);
            setShowResults(false);
        }
    }, [queryDebounce]);

    const handleSelectProduct = (id, title, category) => {
        navigate(`/${category}/${id}/${title}`);
        setShowResults(false);
    };

    const handleSearch = () => {
        if (query) {
            navigate({
                pathname: '/products',
                search: createSearchParams({ title: query }).toString(),
            });
            setShowResults(false)
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query) {
            handleSearch()
        }
    };

    return (
        <div className='w-1/3 flex items-center relative'>
            <InputField
                type='text'
                value={query}
                handleChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                placeholder='Search product by name'
                className='w-full text-sm text-gray-600 border-0 outline-none'
            />
            <div onClick={handleSearch}>
                <FaSearch size={20} className='text-gray-600 hover:cursor-pointer' />
            </div>
            {showResults && products.length > 0 && (
                <div className='absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg mt-1 z-10'>
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className='p-2 flex gap-3 items-center hover:bg-gray-100 cursor-pointer hover:text-main'
                            onClick={() => handleSelectProduct(product._id, product.title, product.category)}
                        >
                            <img src={product.thumbnail} alt={product.title} className='w-10 h-10 object-cover' />
                            <div className='text-sm'>{product.title}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default memo(Search);