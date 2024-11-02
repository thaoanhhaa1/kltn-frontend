'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { IGetRentalRequestRatingByOwner } from '@/interfaces/dashboard';
import { getRentalRequestStatusText } from '@/lib/utils';
import { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

const chartConfig = {};

const RentalRequestRating = ({ data }: { data: Array<IGetRentalRequestRatingByOwner> }) => {
    const chartData = useMemo(
        () =>
            data.map((item) => ({
                ...item,
                total: item.APPROVED + item.PENDING + item.REJECTED,
            })),
        [data],
    );

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
                        <Line type="monotone" dataKey="total" stroke="#8884d8" name="Yêu cầu mới" strokeWidth={2} />
                        <Line
                            type="monotone"
                            dataKey="PENDING"
                            stroke="#ffc658"
                            name={getRentalRequestStatusText('PENDING')}
                            strokeWidth={2}
                        />
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
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default RentalRequestRating;
