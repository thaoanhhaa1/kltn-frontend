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
import { ICountTransactionsByStatusAndMonth } from '@/interfaces/dashboard';
import { getTransactionStatusText } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
    PENDING: {
        label: getTransactionStatusText('PENDING'),
        color: 'hsl(var(--chart-1))',
    },
    COMPLETED: {
        label: getTransactionStatusText('COMPLETED'),
        color: 'hsl(var(--chart-2))',
    },
    CANCELLED: {
        label: getTransactionStatusText('CANCELLED'),
        color: 'hsl(var(--chart-3))',
    },
} satisfies ChartConfig;

const CountTransactionsByStatusAndMonth = ({ data }: { data: ICountTransactionsByStatusAndMonth[] }) => {
    return (
        <Card>
            <CardContent>
                <ChartContainer className="h-[400px] w-full pt-4" config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => `Tháng ${value}`}
                        />
                        <YAxis width={80} tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="CANCELLED" stackId="a" fill="var(--color-CANCELLED)" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="COMPLETED" stackId="a" fill="var(--color-COMPLETED)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="PENDING" stackId="a" fill="var(--color-PENDING)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default CountTransactionsByStatusAndMonth;
