import { useSearchParams } from 'next/navigation';

const usePagination = () => {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') || 1);
    const pageSize = Number(searchParams.get('pageSize') || 10);

    return { page, pageSize };
};

export default usePagination;
