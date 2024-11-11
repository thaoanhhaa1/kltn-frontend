'use client';

import { IGetRevenueAndFeeByMonth } from '@/interfaces/dashboard';

import { Card, CardContent } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
    revenue: {
        label: 'Doanh thu',
        color: 'hsl(var(--chart-2))',
    },
    fee: {
        label: 'Phí',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

const RevenueAndFee = ({ data }: { data: Array<IGetRevenueAndFeeByMonth> }) => {
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
                        <YAxis
                            width={80}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => formatCurrency(value)}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    format={(value) => formatCurrency(Number(value), true)}
                                />
                            }
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="revenue" stackId="a" fill="var(--color-revenue)" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="fee" stackId="a" fill="var(--color-fee)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default RevenueAndFee;
