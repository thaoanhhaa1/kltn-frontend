'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { IGetContractCancellationRateByOwner } from '@/interfaces/dashboard';
import { useMemo } from 'react';
import { LabelList, Pie, PieChart } from 'recharts';
import { NameType } from 'recharts/types/component/DefaultTooltipContent';

const chartConfig = {
    1: {
        label: 'Tháng 01',
        color: '#FF9800',
    },
    2: {
        label: 'Tháng 02',
        color: '#9E9E9E',
    },
    3: {
        label: 'Tháng 03',
        color: '#4CAF50',
    },
    4: {
        label: 'Tháng 04',
        color: '#2196F3',
    },
    5: {
        label: 'Tháng 05',
        color: '#9C27B0',
    },
    6: {
        label: 'Tháng 06',
        color: '#FF5722',
    },
    7: {
        label: 'Tháng 07',
        color: '#795548',
    },
    8: {
        label: 'Tháng 08',
        color: '#607D8B',
    },
    9: {
        label: 'Tháng 09',
        color: '#00BCD4',
    },
    10: {
        label: 'Tháng 10',
        color: '#FFC107',
    },
    11: {
        label: 'Tháng 11',
        color: '#4CAF50',
    },
    12: {
        label: 'Tháng 12',
        color: '#3F51B5',
    },
} satisfies ChartConfig;

const ContractCancelRate = ({ data }: { data: Array<IGetContractCancellationRateByOwner> }) => {
    const chartData = useMemo(
        () =>
            data.map((item) => ({
                ...item,
                month: item.month.toString(),
                fill: chartConfig[item.month as keyof typeof chartConfig]?.color,
            })),
        [data],
    );

    const tooltipLabelFormatter = (value: NameType | undefined) => `Tháng ${value}`;
    const labelListFormatter = (value: keyof typeof chartConfig) => chartConfig[value]?.label;

    return (
        <Card className="flex-1">
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto mt-6 aspect-square max-h-[400px] [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent labelFormat={tooltipLabelFormatter} nameKey="count" hideLabel />
                            }
                        />
                        <Pie data={chartData} dataKey="count" nameKey="month">
                            <LabelList
                                dataKey="month"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={labelListFormatter}
                            />
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent classNameItem="whitespace-nowrap" />}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default ContractCancelRate;
