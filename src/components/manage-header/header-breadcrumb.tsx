'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import useBreadcrumb from '@/context/breadcrumb';
import Link from 'next/link';
import { Fragment } from 'react';

const HeaderBreadcrumb = () => {
    const { breadcrumb } = useBreadcrumb();

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {breadcrumb.map((item, index) => (
                    <Fragment key={index}>
                        {index ? <BreadcrumbSeparator /> : null}
                        {item.link ? (
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={item.link}>{item.title}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        ) : (
                            <BreadcrumbItem>
                                <BreadcrumbPage>{item.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        )}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default HeaderBreadcrumb;
