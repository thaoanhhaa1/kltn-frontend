'use client';

import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/useDebounce';
import { SEARCH } from '@/path';
import { useRouter } from 'next/navigation';
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';

const Search = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const searchDebounced = useDebounce(search, 500);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            router.push(`${SEARCH}?q=${search}`);
            return;
        }
    };

    useEffect(() => {
        if (searchDebounced) router.push(`${SEARCH}?q=${searchDebounced}`);
    }, [router, searchDebounced]);

    return (
        <Input
            type="text"
            placeholder="Tìm kiếm bất động sản..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    );
};

export default Search;
