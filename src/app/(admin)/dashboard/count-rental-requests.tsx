'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
    ICountRentalRequestByDay,
    ICountRentalRequestByMonth,
    ICountRentalRequestByWeek,
} from '@/interfaces/dashboard';
import { Flex, Select } from 'antd';
import { useState } from 'react';
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';

const chartConfig = {
    day: {
        label: 'Yêu cầu thuê nhà',
        color: 'hsl(var(--chart-2))',
    },
    week: {
        label: 'Yêu cầu thuê nhà',
        color: 'hsl(var(--chart-2))',
    },
    month: {
        label: 'Yêu cầu thuê nhà',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

const selectOptions = [
    { value: 'day', label: 'Theo ngày' },
    { value: 'week', label: 'Theo tuần' },
    { value: 'month', label: 'Theo tháng' },
];

const CountRentalRequest = ({
    dayData,
    monthData,
    weekData,
}: {
    dayData: Array<ICountRentalRequestByDay>;
    weekData: Array<ICountRentalRequestByWeek>;
    monthData: Array<ICountRentalRequestByMonth>;
}) => {
    const [data, setData] = useState<{
        selected: string;
        label: string;
        data: Array<ICountRentalRequestByDay | ICountRentalRequestByWeek | ICountRentalRequestByMonth>;
    }>({
        selected: 'day',
        label: 'Ngày',
        data: dayData,
    });

    const handleChange = (value: string) => {
        setData({
            selected: value,
            label: value === 'day' ? 'Ngày' : value === 'week' ? 'Tuần' : 'Tháng',
            data: value === 'day' ? dayData : value === 'week' ? weekData : monthData,
        });
    };

    return (
        <Card>
            <CardContent>
                <Flex
                    justify="flex-end"
                    style={{
                        paddingBlock: '1rem',
                    }}
                >
                    <Select options={selectOptions} defaultValue="day" onChange={handleChange} />
                </Flex>
                <ChartContainer className="h-[400px] w-full pt-4" config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={data.data}
                        margin={{
                            top: 50,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={data.selected}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `${data.label} ${value}`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" labelFormat={() => `Số lượng`} />}
                        />
                        <Line
                            dataKey="count"
                            type="natural"
                            stroke="var(--color-day)"
                            strokeWidth={2}
                            dot={{
                                fill: 'var(--color-day)',
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                        </Line>
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default CountRentalRequest;
