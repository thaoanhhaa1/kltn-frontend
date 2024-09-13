'use client';

import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/useDebounce';
import { SEARCH } from '@/path';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

const Search = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const searchDebounced = useDebounce(search, 500);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        if (searchDebounced) router.push(`${SEARCH}?q=${searchDebounced}`);
    }, [router, searchDebounced]);

    return (
        <Input
            type="search"
            placeholder="Tìm kiếm bất động sản..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            onChange={handleChange}
        />
    );
};

export default Search;
