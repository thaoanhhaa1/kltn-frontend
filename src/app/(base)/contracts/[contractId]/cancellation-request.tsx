'use client';

import ContractCancelRequest from '@/components/contract-cancel-request';
import { IContractCancelRequestDetail } from '@/interfaces/contract-cancel-request';
import { Empty, Segmented } from 'antd';
import { useState } from 'react';

const CancellationRequest = ({
    cancelRequest,
    cancelRequestHandled,
}: {
    cancelRequest: IContractCancelRequestDetail | null;
    cancelRequestHandled: Array<IContractCancelRequestDetail>;
}) => {
    const [segmentedValue, setSegmentedValue] = useState<string>('Yêu cầu chờ xử lý');

    return (
        <div>
            <Segmented<string> options={['Yêu cầu chờ xử lý', 'Yêu cầu đã xử lý']} onChange={setSegmentedValue} />
            <div className="mt-4">
                {/* {loading && (
                    <Flex justify="center">
                        <Spin size="large" />
                    </Flex>
                )} */}
                {segmentedValue === 'Yêu cầu chờ xử lý' &&
                    (cancelRequest ? (
                        <ContractCancelRequest request={cancelRequest} />
                    ) : (
                        <Empty description="Không có yêu cầu nào đang chờ xử lý" />
                    ))}
                {segmentedValue !== 'Yêu cầu chờ xử lý' &&
                    (cancelRequestHandled.length ? (
                        cancelRequestHandled.map((request) => (
                            <ContractCancelRequest key={request.id} request={request} />
                        ))
                    ) : (
                        <Empty description="Không có yêu cầu nào đã xử lý" />
                    ))}
            </div>
        </div>
    );
};

export default CancellationRequest;
