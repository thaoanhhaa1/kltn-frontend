import { useSearchParams } from 'next/navigation';

const usePagination = (pageSizeParam: number = 10) => {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') || 1);
    const pageSize = Number(searchParams.get('pageSize') || pageSizeParam);

    return { page, pageSize };
};

export default usePagination;
