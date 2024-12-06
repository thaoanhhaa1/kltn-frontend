import Title from '@/components/title';
import { SuggestSearch } from '@/interfaces/property';
import { Flex } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const SearchSuggestItem = ({ data }: { data: SuggestSearch }) => {
    return (
        <Link href={`/${data.slug}`} prefetch>
            <Flex gap={12} align="center" className="px-[27px]">
                <Image
                    alt={data.title}
                    src={data.images[0]}
                    width={70}
                    height={50}
                    className="rounded-lg object-cover w-[70px] h-[50px]"
                />
                <Title level={5}>{data.title}</Title>
            </Flex>
        </Link>
    );
};

export default SearchSuggestItem;
