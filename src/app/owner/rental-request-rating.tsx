'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { IGetContractCancellationRateByOwner, IGetRentalRequestRatingByOwner } from '@/interfaces/dashboard';
import { getRentalRequestStatusText } from '@/lib/utils';
import { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

const chartConfig = {};

const RentalRequestRating = ({
    data,
    cancelRate,
}: {
    data: Array<IGetRentalRequestRatingByOwner>;
    cancelRate: Array<IGetContractCancellationRateByOwner>;
}) => {
    const chartData = useMemo(() => {
        const newArray = [
            ...data.map((item) => ({
                ...item,
                total: item.APPROVED + item.PENDING + item.REJECTED,
                cancel: 0,
            })),
        ];

        if (cancelRate.length > 0) {
            let index = 0;
            let indexCancel = 0;
            let item = data[index];
            let itemCancel = cancelRate[indexCancel];

            while (itemCancel.month < item.month) {
                newArray.unshift({
                    month: itemCancel.month,
                    year: itemCancel.year,
                    APPROVED: 0,
                    PENDING: 0,
                    REJECTED: 0,
                    total: 0,
                    cancel: itemCancel.count,
                });
            }

            for (; index < data.length; index++) {
                item = data[index];
                itemCancel = cancelRate[indexCancel];

                if (itemCancel && item.month === itemCancel.month) {
                    newArray[index].cancel = itemCancel.count;
                    indexCancel++;
                }
            }
        }

        return newArray;
    }, [cancelRate, data]);

    const tickFormatter = (value: string) => `Tháng ${value}`;

    return (
        <Card>
            <CardContent>
                <ChartContainer className="h-[400px] w-full pt-4" config={chartConfig}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickFormatter={tickFormatter} />
                        <YAxis />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Legend />
                        {/* <Line type="monotone" dataKey="total" stroke="#8884d8" name="Yêu cầu mới" strokeWidth={2} />
                        <Line
                            type="monotone"
                            dataKey="PENDING"
                            stroke="#ffc658"
                            name={getRentalRequestStatusText('PENDING')}
                            strokeWidth={2}
                        /> */}
                        <Line
                            type="monotone"
                            dataKey="APPROVED"
                            stroke="#82ca9d"
                            name={getRentalRequestStatusText('APPROVED')}
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="REJECTED"
                            stroke="#ff8042"
                            name={getRentalRequestStatusText('REJECTED')}
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="cancel"
                            stroke="#ff0000"
                            name="Hợp đồng bị huỷ"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default RentalRequestRating;
