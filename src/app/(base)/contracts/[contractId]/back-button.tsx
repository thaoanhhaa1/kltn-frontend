'use client';

import { IContractDetail } from '@/interfaces/contract';
import { OWNER_CONTRACTS, RENTAL_CONTRACTS } from '@/path';
import { useUserStore } from '@/stores/user-store';
import { Button } from 'antd';
import { ChevronLeft } from 'lucide-react';

const BackButton = ({ contract }: { contract: IContractDetail }) => {
    const { user } = useUserStore();
    const isOwner = user?.userId === contract.ownerId;

    return (
        <Button
            href={isOwner ? OWNER_CONTRACTS : RENTAL_CONTRACTS}
            type="text"
            icon={<ChevronLeft className="w-5 h-5" />}
        />
    );
};

export default BackButton;
