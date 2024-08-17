'use client';

import { createContext, useContext, useState } from 'react';

export type BreadcrumbContextType = {
    title: string;
    link?: string;
}[];

export type BreadcrumbContextValue = {
    breadcrumb: BreadcrumbContextType;
    setBreadcrumb: React.Dispatch<React.SetStateAction<BreadcrumbContextType>>;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue>({
    breadcrumb: [],
    setBreadcrumb: () => {},
});

const useBreadcrumb = () => useContext(BreadcrumbContext);

const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
    const [breadcrumb, setBreadcrumb] = useState<BreadcrumbContextType>([]);

    return (
        <BreadcrumbContext.Provider
            value={{
                breadcrumb,
                setBreadcrumb,
            }}
        >
            {children}
        </BreadcrumbContext.Provider>
    );
};

export { BreadcrumbProvider };
export default useBreadcrumb;
