'use client';

import ButtonLink from '@/components/button/button-link';
import { IContractDetail } from '@/interfaces/contract';
import { OWNER_CONTRACTS, RENTAL_CONTRACTS } from '@/path';
import { useUserStore } from '@/stores/user-store';
import { ChevronLeft } from 'lucide-react';

const BackButton = ({ contract }: { contract: IContractDetail }) => {
    const { user } = useUserStore();
    const isOwner = user?.userId === contract.ownerId;

    return (
        <ButtonLink href={isOwner ? OWNER_CONTRACTS : RENTAL_CONTRACTS}>
            <ChevronLeft className="w-5 h-5" />
        </ButtonLink>
    );
};

export default BackButton;
